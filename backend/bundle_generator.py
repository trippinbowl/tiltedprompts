"""
tiltedprompts – Bundle Generator API

Flask service that generates AI prompt bundles for SMBs.
POST /generate  → produces structured JSON + optional markdown.
GET  /health     → health check.
GET  /bundles    → list saved bundles.
GET  /bundles/<id> → retrieve a specific bundle.
"""
import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, request, jsonify

import config
from llm_provider import generate_with_llm

# ---- Logging Setup ----
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("bundle_generator")

# ---- Activity Log ----
LOG_FILE = config.BUNDLES_DIR / "_activity_log.jsonl"

def log_activity(entry: dict):
    """Append a JSON line to the activity log."""
    entry["timestamp"] = datetime.now(timezone.utc).isoformat()
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

# ---- Flask App ----
app = Flask(__name__)


# ==============================
#  SYSTEM PROMPT FOR GENERATION
# ==============================
SYSTEM_PROMPT = f"""You are the {config.BRAND_NAME} AI product generator.
You create high-quality, actionable AI prompt bundles and GPT instruction sets
for small and medium businesses (SMBs), especially in India.

Your prompts must be:
- Extremely "dumbed down" and simple, designed for busy, non-technical small business owners.
- Structured as complete "fill-in-the-blank" templates that the user can directly copy and paste into ChatGPT.
- Written so the user NEVER has to think about prompt engineering. Provide explicit bracketed placeholders like [INSERT CUSTOMER NAME] or [INSERT PRODUCT PRICE].
- Focused on solving day-to-day real-world problems (e.g., handling angry customers, delayed shipments, quick WhatsApp follow-ups, daily operations).
- Specific to the given niche (not generic fluff).
- In the requested language and tone.

CRITICAL RULES:
1. Your ENTIRE response must be a single valid JSON object.
2. Do NOT include any explanation, commentary, or analysis.
3. Do NOT wrap the JSON in markdown code fences.
4. Do NOT include any text before or after the JSON.
5. Start your response with {{ and end it with }}.
6. Ensure all strings are properly escaped for JSON."""


def build_generation_prompt(params: dict) -> str:
    """Build the user prompt that asks the LLM to generate a bundle."""
    niche = params.get("niche", "Indian SMB marketing")
    language = params.get("language", "English")
    tone = params.get("tone", "professional yet friendly")
    bundle_type = params.get("bundle_type", "prompts")  # prompts | gpt_instructions | mixed
    count = params.get("count", 10)
    extra_notes = params.get("extra_notes", "")

    prompt = f"""Generate a {bundle_type} bundle for the following:

NICHE: {niche}
LANGUAGE: {language}
TONE: {tone}
NUMBER OF PROMPTS: {count}
EXTRA NOTES: {extra_notes if extra_notes else "None"}

Respond with a JSON object matching this EXACT schema:

{{
  "prompts": [
    {{
      "title": "short descriptive title",
      "description": "1-2 sentence description of what this prompt does",
      "prompt_text": "the actual copy-paste ready prompt",
      "use_case": "specific business scenario where this is useful"
    }}
  ],
  "gpt_instructions": {{
    "system_message": "a system message to turn ChatGPT/any LLM into a specialized assistant for this niche",
    "example_user_messages": ["example question 1", "example question 2", "example question 3"],
    "example_outputs": ["example response 1", "example response 2", "example response 3"]
  }},
  "packaging": {{
    "product_name": "catchy product name for Gumroad/sales page",
    "description": "compelling 2-3 sentence product description for the sales page",
    "pricing_tiers": {{
      "free": "what's included free (if anything)",
      "starter": "price and what's included at $5-10",
      "pro": "price and what's included at $15-25"
    }},
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  }}
}}

{"If bundle_type is 'prompts', focus on the prompts array. " if bundle_type == "prompts" else ""}
{"If bundle_type is 'gpt_instructions', focus on the gpt_instructions section with a detailed system message. " if bundle_type == "gpt_instructions" else ""}
{"If bundle_type is 'mixed', give equal attention to both prompts and gpt_instructions. " if bundle_type == "mixed" else ""}

Generate exactly {count} prompts in the prompts array.
Make each prompt unique and focus strictly on day-to-day operations and problem-solving for {niche}.
Every prompt MUST be a fill-in-the-blank template that physically does the work for them (e.g. "Act as an expert copywriter. Write a 3-part WhatsApp message sequence for my customer [CUSTOMER_NAME] who abandoned their cart for [PRODUCT_NAME]. Use a persuasive, urgent tone...").
Do not output meta-prompts. Output the exact template the business owner will copy-paste."""

    return prompt


def parse_llm_response(raw: str) -> dict:
    """
    Parse the LLM response into a structured dict.
    Handles:
    - Clean JSON
    - JSON wrapped in markdown fences
    - DeepSeek-R1 <think> blocks + JSON
    - Leading/trailing analysis text around JSON
    - Trailing commas before } or ]
    """
    from llm_provider import extract_json_from_text

    result = extract_json_from_text(raw)
    if result is not None:
        return result

    # Last resort: return error with a snippet of the raw response
    logger.warning(f"Failed to extract JSON from LLM response ({len(raw)} chars)")
    logger.debug(f"Raw response preview: {raw[:500]}")
    return {
        "error": "Failed to parse LLM response as JSON",
        "raw_response": raw[:2000],
    }


def bundle_to_markdown(bundle: dict, params: dict) -> str:
    """Convert a structured bundle JSON to a human-readable markdown file."""
    packaging = bundle.get("packaging", {})
    prompts = bundle.get("prompts", [])
    gpt = bundle.get("gpt_instructions", {})

    md = []
    md.append(f"# {packaging.get('product_name', 'Prompt Bundle')}")
    md.append(f"\n*by {config.BRAND_NAME}*\n")
    md.append(f"> {packaging.get('description', '')}\n")
    md.append(f"**Niche:** {params.get('niche', 'General')}")
    md.append(f"**Language:** {params.get('language', 'English')}")
    md.append(f"**Prompts included:** {len(prompts)}\n")

    # Pricing
    pricing = packaging.get("pricing_tiers", {})
    if pricing:
        md.append("## 💰 Pricing\n")
        for tier, detail in pricing.items():
            md.append(f"- **{tier.capitalize()}**: {detail}")
        md.append("")

    # Prompts
    if prompts:
        md.append("## 📝 Prompts\n")
        for i, p in enumerate(prompts, 1):
            md.append(f"### {i}. {p.get('title', f'Prompt {i}')}")
            md.append(f"\n*{p.get('description', '')}*\n")
            md.append(f"**Use case:** {p.get('use_case', '')}\n")
            md.append(f"```\n{p.get('prompt_text', '')}\n```\n")

    # GPT Instructions
    if gpt and gpt.get("system_message"):
        md.append("## 🤖 Custom GPT Instructions\n")
        md.append("### System Message\n")
        md.append(f"```\n{gpt['system_message']}\n```\n")
        if gpt.get("example_user_messages"):
            md.append("### Example User Messages\n")
            for msg in gpt["example_user_messages"]:
                md.append(f"- {msg}")
            md.append("")
        if gpt.get("example_outputs"):
            md.append("### Example Outputs\n")
            for out in gpt["example_outputs"]:
                md.append(f"- {out}")
            md.append("")

    md.append("---")
    md.append(f"*Generated by {config.BRAND_NAME} | {config.TAGLINE}*")
    md.append(f"*Support: {config.SUPPORT_EMAIL}*")

    return "\n".join(md)


# ==============================
#  ROUTES
# ==============================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "brand": config.BRAND_NAME,
        "llm_provider": config.LLM_PROVIDER,
    })


@app.route("/generate", methods=["POST"])
def generate():
    """
    Generate a prompt bundle.

    Input JSON:
    {
        "niche": "Instagram marketing for Indian D2C brands",
        "language": "English",          // optional, default: English
        "tone": "professional",         // optional
        "bundle_type": "prompts",       // prompts | gpt_instructions | mixed
        "count": 10,                    // optional, default: 10
        "extra_notes": ""               // optional
    }
    """
    params = request.get_json(force=True, silent=True) or {}

    # Defaults
    params.setdefault("niche", "Indian SMB marketing")
    params.setdefault("language", "English")
    params.setdefault("tone", "professional yet friendly")
    params.setdefault("bundle_type", "prompts")
    params.setdefault("count", 10)
    params.setdefault("extra_notes", "")

    logger.info(f"Generate request: niche={params['niche']}, type={params['bundle_type']}, count={params['count']}")

    # Build prompt and call LLM
    user_prompt = build_generation_prompt(params)
    try:
        raw_response = generate_with_llm(
            prompt=user_prompt,
            system_msg=SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=16384,  # R1 models use thinking tokens from this budget
        )
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        return jsonify({"error": f"LLM call failed: {str(e)}"}), 502

    # Parse response
    bundle = parse_llm_response(raw_response)

    if "error" in bundle:
        logger.warning(f"Parse failed: {bundle['error']}")
        # Dump raw response to file for debugging
        debug_path = config.BUNDLES_DIR / "_last_raw_response.txt"
        with open(debug_path, "w", encoding="utf-8") as f:
            f.write(raw_response)
        logger.info(f"Raw LLM response saved to {debug_path} for debugging")
        bundle["debug_file"] = str(debug_path)
        return jsonify(bundle), 422

    # Generate ID and save
    bundle_id = str(uuid.uuid4())[:8]
    product_name = bundle.get("packaging", {}).get("product_name", f"bundle-{bundle_id}")
    safe_name = "".join(c if c.isalnum() or c in "-_ " else "" for c in product_name).strip().replace(" ", "-").lower()
    bundle_dir = config.BUNDLES_DIR / f"{safe_name}_{bundle_id}"
    bundle_dir.mkdir(parents=True, exist_ok=True)

    # Save JSON
    json_path = bundle_dir / "bundle.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(bundle, f, indent=2, ensure_ascii=False)

    # Save Markdown
    md_content = bundle_to_markdown(bundle, params)
    md_path = bundle_dir / "bundle.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # Save params for reference
    params_path = bundle_dir / "params.json"
    with open(params_path, "w", encoding="utf-8") as f:
        json.dump(params, f, indent=2, ensure_ascii=False)

    # Log activity
    log_activity({
        "action": "generate",
        "bundle_id": bundle_id,
        "product_name": product_name,
        "niche": params["niche"],
        "bundle_type": params["bundle_type"],
        "count": params["count"],
    })

    logger.info(f"Bundle saved: {bundle_dir.name}")

    return jsonify({
        "success": True,
        "bundle_id": bundle_id,
        "product_name": product_name,
        "files": {
            "json": str(json_path),
            "markdown": str(md_path),
        },
        "preview": {
            "description": bundle.get("packaging", {}).get("description", ""),
            "prompt_count": len(bundle.get("prompts", [])),
            "tags": bundle.get("packaging", {}).get("tags", []),
        },
        "bundle": bundle,
    })


@app.route("/bundles", methods=["GET"])
def list_bundles():
    """List all saved bundles."""
    bundles = []
    for d in sorted(config.BUNDLES_DIR.iterdir()):
        if d.is_dir() and (d / "bundle.json").exists():
            try:
                with open(d / "bundle.json", "r", encoding="utf-8") as f:
                    data = json.load(f)
                params = {}
                if (d / "params.json").exists():
                    with open(d / "params.json", "r", encoding="utf-8") as f:
                        params = json.load(f)
                packaging = data.get("packaging", {})
                bundles.append({
                    "bundle_id": d.name.split("_")[-1] if "_" in d.name else d.name,
                    "folder": d.name,
                    "product_name": packaging.get("product_name", d.name),
                    "niche": params.get("niche", ""),
                    "description": packaging.get("description", ""),
                    "prompt_count": len(data.get("prompts", [])),
                    "tags": packaging.get("tags", []),
                })
            except Exception as e:
                logger.warning(f"Error reading bundle {d.name}: {e}")
    return jsonify({"bundles": bundles, "total": len(bundles)})


@app.route("/bundles/<bundle_folder>", methods=["GET"])
def get_bundle(bundle_folder: str):
    """Get a specific bundle by folder name."""
    bundle_dir = config.BUNDLES_DIR / bundle_folder
    if not bundle_dir.exists():
        # Try fuzzy match by bundle_id suffix
        matches = [d for d in config.BUNDLES_DIR.iterdir() if d.is_dir() and d.name.endswith(bundle_folder)]
        if matches:
            bundle_dir = matches[0]
        else:
            return jsonify({"error": "Bundle not found"}), 404

    json_path = bundle_dir / "bundle.json"
    if not json_path.exists():
        return jsonify({"error": "Bundle data not found"}), 404

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return jsonify({"bundle": data, "folder": bundle_dir.name})


@app.route("/bundles/<bundle_folder>/preview", methods=["GET"])
def preview_bundle(bundle_folder: str):
    """Get a short preview of a bundle: summary + 3 example prompts."""
    bundle_dir = config.BUNDLES_DIR / bundle_folder
    if not bundle_dir.exists():
        matches = [d for d in config.BUNDLES_DIR.iterdir() if d.is_dir() and d.name.endswith(bundle_folder)]
        if matches:
            bundle_dir = matches[0]
        else:
            return jsonify({"error": "Bundle not found"}), 404

    json_path = bundle_dir / "bundle.json"
    if not json_path.exists():
        return jsonify({"error": "Bundle data not found"}), 404

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    packaging = data.get("packaging", {})
    prompts = data.get("prompts", [])

    return jsonify({
        "product_name": packaging.get("product_name", ""),
        "description": packaging.get("description", ""),
        "total_prompts": len(prompts),
        "sample_prompts": [
            {"title": p["title"], "use_case": p.get("use_case", "")}
            for p in prompts[:3]
        ],
        "tags": packaging.get("tags", []),
    })


# ==============================
#  REGISTER WEBHOOK & REPORT ROUTES
# ==============================
from webhook_handler import register_webhook_routes
register_webhook_routes(app)


# ==============================
#  ENTRY POINT
# ==============================
if __name__ == "__main__":
    logger.info(f"Starting {config.BRAND_NAME} Bundle Generator on {config.HOST}:{config.PORT}")
    logger.info(f"LLM Provider: {config.LLM_PROVIDER}")
    logger.info(f"Bundles dir: {config.BUNDLES_DIR}")
    logger.info(f"Endpoints: /generate, /bundles, /health, /gumroad-webhook, /verify-license, /lead-capture, /report")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
