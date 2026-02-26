"""
tiltedprompts – LLM Abstraction Layer

Single function `generate_with_llm()` that routes to local or DeepSeek
based on config. All providers use OpenAI-compatible chat/completions format.

To swap providers: change LLM_PROVIDER in .env (no code changes needed).
"""
import json
import logging
import re
import requests
import config

logger = logging.getLogger(__name__)

# ---- JSON-enforcement system message (prepended to every call) ----
JSON_ENFORCEMENT_PREFIX = (
    "You are a JSON-only API. You MUST return exactly one valid JSON object "
    "matching the requested schema. Do NOT include any explanations, commentary, "
    "analysis, thinking, code fences, or any text before or after the JSON. "
    "Your entire response must be parseable by json.loads(). "
    "Start your response with { and end it with }."
)


def _call_openai_compatible(
    base_url: str,
    model: str,
    prompt: str,
    system_msg: str = "",
    api_key: str = "",
    temperature: float = 0.7,
    max_tokens: int = 4000,
    json_mode: bool = True,
) -> str:
    """Generic caller for any OpenAI-compatible /v1/chat/completions endpoint."""
    # Prepend JSON enforcement to the system message
    full_system = f"{JSON_ENFORCEMENT_PREFIX}\n\n{system_msg}" if system_msg else JSON_ENFORCEMENT_PREFIX

    messages = [
        {"role": "system", "content": full_system},
        {"role": "user", "content": prompt},
    ]

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    url = base_url.rstrip("/")
    if not url.endswith("/chat/completions"):
        url += "/chat/completions"

    # Try with response_format first; if model rejects it (400), retry without
    if json_mode:
        payload_with_fmt = {**payload, "response_format": {"type": "json_object"}}
        logger.info(f"Calling LLM at {url} (model={model}, json_mode=True)")
        try:
            resp = requests.post(url, headers=headers, json=payload_with_fmt, timeout=180)
            if resp.status_code == 400:
                logger.warning("Model rejected response_format, retrying without it")
            else:
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
                logger.debug(f"Raw LLM response length: {len(content)} chars")
                return content
        except requests.exceptions.HTTPError:
            logger.warning("response_format caused HTTP error, retrying without it")

    # Fallback: call without response_format
    logger.info(f"Calling LLM at {url} (model={model}, json_mode=False)")
    resp = requests.post(url, headers=headers, json=payload, timeout=180)
    resp.raise_for_status()
    data = resp.json()

    content = data["choices"][0]["message"]["content"]
    logger.debug(f"Raw LLM response length: {len(content)} chars")
    return content


def call_local_llm(prompt: str, system_msg: str = "", **kwargs) -> str:
    """Call the local LLM (LM Studio, Ollama, text-generation-webui, etc.)."""
    # Support both LOCAL_LLM_URL and LOCAL_LLM_BASE_URL env vars
    base_url = config.LOCAL_LLM_URL
    # Strip /v1/chat/completions or /chat/completions if present
    for suffix in ["/v1/chat/completions", "/chat/completions"]:
        if base_url.endswith(suffix):
            base_url = base_url[: -len(suffix)]
            break
    # Ensure /v1 is present
    if not base_url.endswith("/v1"):
        base_url = base_url.rstrip("/") + "/v1"

    return _call_openai_compatible(
        base_url=base_url,
        model=config.LOCAL_LLM_MODEL,
        prompt=prompt,
        system_msg=system_msg,
        **kwargs,
    )


def call_deepseek(prompt: str, system_msg: str = "", **kwargs) -> str:
    """Call DeepSeek API."""
    return _call_openai_compatible(
        base_url=config.DEEPSEEK_BASE_URL,
        model=config.DEEPSEEK_MODEL,
        prompt=prompt,
        system_msg=system_msg,
        api_key=config.DEEPSEEK_API_KEY,
        **kwargs,
    )


# ---- Provider registry ----
_PROVIDERS = {
    "local": call_local_llm,
    "deepseek": call_deepseek,
}


def extract_json_from_text(raw: str) -> dict | None:
    """
    Robustly extract a JSON object from LLM output that may contain:
    - <think>...</think> blocks (DeepSeek-R1) — with or without closing tag
    - ```json ... ``` fences
    - Leading/trailing commentary or analysis
    - Mixed text + JSON

    Returns parsed dict, or None if extraction fails.
    """
    text = raw.strip()

    # 1. Remove <think>...</think> blocks (DeepSeek-R1 reasoning)
    #    Handle BOTH closed and unclosed think blocks
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)

    # If there's still an unclosed <think> tag (no </think>), remove from <think> to end
    # BUT first check if there's JSON after it by looking for </think> that might be malformed
    if "<think>" in text:
        # Find the last </think> or assume it goes until we see the JSON start
        think_start = text.find("<think>")
        # Look for any closing variant
        close_idx = -1
        for closer in ["</think>", "</Think>", "</ think>"]:
            idx = text.find(closer, think_start)
            if idx > close_idx:
                close_idx = idx + len(closer)

        if close_idx > think_start:
            # Found a closing tag variant — remove that block
            text = text[:think_start] + text[close_idx:]
        else:
            # No closing tag at all — the JSON should start after the think content
            # Strategy: find the first top-level { after <think> that looks like JSON
            after_think = text[think_start + len("<think>"):]
            # Find a line that starts with { (the actual JSON output)
            json_start = _find_json_start(after_think)
            if json_start >= 0:
                text = after_think[json_start:]
            else:
                # Last resort: just remove everything before the first {
                text = text[think_start + len("<think>"):]

    text = text.strip()

    # 2. Try direct parse (best case: clean JSON)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Strip markdown code fences: ```json ... ``` or ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*\n?(.*?)```", text, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # 4. Find the outermost { ... } using bracket counting
    json_obj = _extract_braced_json(text)
    if json_obj is not None:
        return json_obj

    return None


def _find_json_start(text: str) -> int:
    """
    Find the position where a JSON object likely starts.
    Looks for a { that's followed by a quoted key (typical JSON object start).
    """
    i = 0
    while i < len(text):
        pos = text.find("{", i)
        if pos < 0:
            return -1
        # Check if this { is followed by a quoted key within a few chars
        after = text[pos:pos+30].strip()
        if re.match(r'\{\s*"', after):
            return pos
        i = pos + 1
    return -1


def _extract_braced_json(text: str) -> dict | None:
    """Extract a JSON object using bracket counting, starting from the first { that looks like JSON."""
    start_idx = _find_json_start(text)
    if start_idx < 0:
        # Fallback: try the first { regardless
        start_idx = text.find("{")
        if start_idx < 0:
            return None

    depth = 0
    in_string = False
    escape = False

    for i in range(start_idx, len(text)):
        c = text[i]
        if escape:
            escape = False
            continue
        if c == "\\":
            escape = True
            continue
        if c == '"' and not escape:
            in_string = not in_string
            continue
        if in_string:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                candidate = text[start_idx:i + 1]
                try:
                    return json.loads(candidate)
                except json.JSONDecodeError:
                    # Try cleaning trailing commas
                    cleaned = re.sub(r",\s*([}\]])", r"\1", candidate)
                    try:
                        return json.loads(cleaned)
                    except json.JSONDecodeError:
                        return None

    return None


def generate_with_llm(
    prompt: str,
    system_msg: str = "",
    provider: str | None = None,
    **kwargs,
) -> str:
    """
    Main entry point. Routes to the configured LLM provider.

    Args:
        prompt:     The user-facing prompt text.
        system_msg: Optional system message for context/instructions.
        provider:   Override config.LLM_PROVIDER for this call (optional).
        **kwargs:   Passed through to the provider (temperature, max_tokens, etc.)

    Returns:
        The LLM's text response.
    """
    chosen = provider or config.LLM_PROVIDER
    fn = _PROVIDERS.get(chosen)
    if not fn:
        raise ValueError(
            f"Unknown LLM provider '{chosen}'. Available: {list(_PROVIDERS.keys())}"
        )

    logger.info(f"generate_with_llm → provider={chosen}")
    return fn(prompt, system_msg, **kwargs)
