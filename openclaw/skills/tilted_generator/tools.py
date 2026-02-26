"""
TiltedPrompts — Autonomous Asset Generator Tools

This module contains the core functions that the OpenClaw tilted_asset_generator
skill uses to generate digital assets and push them into the production database.

It can be invoked in two ways:
    1. Programmatically by the OpenClaw agent runtime (import and call functions)
    2. Directly via CLI for cron automation (python tools.py --cron)

Architecture:
    Slack/Cron Trigger → generate_bundle() → Flask API → LLM
                       → transform_to_db_payload()
                       → ingest_to_database() → Next.js API → Supabase

Environment Variables Required:
    TILTEDPROMPTS_API_URL       - Flask bundle generator (e.g., http://localhost:5000)
    TILTEDPROMPTS_INGEST_URL    - Next.js ingestion endpoint
    TILTEDPROMPTS_INGEST_KEY    - API key for ingestion authentication
    TILTEDPROMPTS_INGEST_SECRET - HMAC secret for request signing
"""

import argparse
import hashlib
import hmac
import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from typing import Any

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

FLASK_API_URL = os.getenv("TILTEDPROMPTS_API_URL", "http://localhost:5000")
INGEST_URL = os.getenv(
    "TILTEDPROMPTS_INGEST_URL", "http://localhost:3000/api/ingest-bundle"
)
INGEST_KEY = os.getenv("TILTEDPROMPTS_INGEST_KEY", "a1b2c3d4e5f67890123456789abcdef0")
INGEST_SECRET = os.getenv("TILTEDPROMPTS_INGEST_SECRET", "f9e8d7c6b5a43210987654321fedcba0")

# Timeouts
GENERATE_TIMEOUT = 200  # seconds — LLM generation can be slow on local models
INGEST_TIMEOUT = 30  # seconds — DB insert should be fast

# Rate limiting
MAX_INGESTIONS_PER_HOUR = 20
_ingestion_timestamps: list[float] = []

# ---------------------------------------------------------------------------
# Slack Status Reporting (Layer 1 + Layer 2)
# ---------------------------------------------------------------------------
# Layer 1: Direct Slack webhook — bypasses OpenClaw's LLM entirely.
#   Set SLACK_WEBHOOK_URL to a Slack Incoming Webhook URL and the pipeline
#   will POST status updates directly to your channel. This is the
#   bulletproof path — it works even if the LLM ignores stdout.
#
# Layer 2: Fence protocol — wraps status text in sentinel markers so
#   SKILL.md can instruct the LLM to copy-paste the fenced block verbatim.
#   This is the fallback if Slack webhook is not configured.
#
# Both layers fire on every status update. Configure either or both.
# ---------------------------------------------------------------------------

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "https://hooks.slack.com/services/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P")

STATUS_FENCE_START = "===TILTED_STATUS==="
STATUS_FENCE_END = "===END_STATUS==="

# Status emoji constants
_OK = "✅"
_FAIL = "❌"
_PENDING = "⬜"
_RUNNING = "🔄"


def _post_slack_status(message: str, agent: str = "MSME") -> bool:
    """
    Post a formatted status message to Slack via two channels:

    1. STDOUT with fence markers (Layer 2) — always fires. SKILL.md
       instructs the LLM to relay the fenced block verbatim.
    2. Slack Incoming Webhook (Layer 1) — fires if SLACK_WEBHOOK_URL
       is configured. Completely bypasses the OpenClaw LLM.

    Args:
        message: The status text to post (plain text with emoji).
        agent: Agent label — "MSME" or "Framework".

    Returns:
        True if at least one delivery channel succeeded.
    """
    # ── Layer 2: Fenced stdout (always) ────────────────────────
    fenced = f"\n{STATUS_FENCE_START}\n{message}\n{STATUS_FENCE_END}\n"
    print(fenced, flush=True)

    # ── Layer 1: Direct webhook (if configured) ───────────────
    if not SLACK_WEBHOOK_URL:
        return True  # stdout-only is fine

    try:
        payload = {"text": message}
        resp = requests.post(
            SLACK_WEBHOOK_URL,
            json=payload,
            timeout=10,
        )
        if resp.status_code != 200:
            logger.warning(
                f"Slack webhook returned {resp.status_code}: {resp.text[:200]}"
            )
            return True  # stdout still worked
        return True
    except Exception as e:
        logger.warning(f"Slack webhook failed: {e}")
        return True  # stdout still worked


def _pipeline_status_line(
    generate: str = _PENDING,
    validate: str = _PENDING,
    upload: str = _PENDING,
) -> str:
    """
    Build a one-line pipeline status bar.

    Usage:
        _pipeline_status_line(_OK, _OK, _FAIL)
        → "`Generate` ✅ | `Validate` ✅ | `Upload` ❌"
    """
    return f"`Generate` {generate} | `Validate` {validate} | `Upload` {upload}"


def _format_success_status(
    title: str,
    asset_id: str,
    prompt_count: int,
    is_premium: bool,
    elapsed: float,
    agent: str = "MSME",
    platforms: list[str] | None = None,
) -> str:
    """Format a complete success status block for Slack."""
    tier = "🔒 Pro Tier" if is_premium else "🔓 Free Tier"
    tag_line = ", ".join(platforms) if platforms else "general"
    emoji = "✅" if agent == "MSME" else "🔧"

    return (
        f"{emoji} {'Asset' if agent == 'MSME' else 'Framework Asset'} Published!\n"
        f"\n"
        f"{_pipeline_status_line(_OK, _OK, _OK)}\n"
        f"\n"
        f'📦 "{title}"\n'
        f"🏷️ prompt_bundle — {prompt_count} prompts\n"
        f"{tier}\n"
        f"📊 Tags: {tag_line}\n"
        f"🆔 {asset_id}\n"
        f"⏱️ {elapsed:.0f} seconds\n"
        f"\n"
        f"🌐 Live at: https://tiltedprompts.com/members"
    )


def _format_error_status(
    error_msg: str,
    error_type: str = "Unknown",
    stage: str = "upload",
    elapsed: float = 0,
    agent: str = "MSME",
) -> str:
    """Format a complete error status block for Slack."""
    if stage == "generate":
        status_line = _pipeline_status_line(_FAIL, _PENDING, _PENDING)
    elif stage == "validate":
        status_line = _pipeline_status_line(_OK, _FAIL, _PENDING)
    else:  # upload
        status_line = _pipeline_status_line(_OK, _OK, _FAIL)

    return (
        f"❌ {'Asset' if agent == 'MSME' else 'Framework Asset'} Generation FAILED\n"
        f"\n"
        f"{status_line}\n"
        f"\n"
        f"🚨 Error Type: {error_type}\n"
        f"📝 Details: {error_msg[:300]}\n"
        f"⏱️ {elapsed:.0f} seconds\n"
        f"\n"
        f"💡 Troubleshooting:\n"
        f"• Ensure `python bundle_generator.py` is running\n"
        f"• Ensure `npm run dev` is running (for local dev)\n"
        f"• Check env vars: TILTEDPROMPTS_INGEST_KEY, TILTEDPROMPTS_INGEST_SECRET"
    )


# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("tilted_generator")


# ---------------------------------------------------------------------------
# Niche Rotation Schedule (for cron mode)
# ---------------------------------------------------------------------------

NICHE_SCHEDULE: dict[int, dict[str, Any]] = {
    # -----------------------------------------------------------------------
    # ZERO-THINKING NICHE SCHEDULE
    # Each day targets ONE specific painful moment, not a broad category.
    # The niche string IS the problem statement — the LLM uses it directly.
    # -----------------------------------------------------------------------
    0: {  # Monday — Shopify / D2C
        "niche": "5 ready-to-send Instagram DM replies for when a customer "
                 "comments 'price?' or 'too expensive' on your Shopify product "
                 "post. Each reply should be a complete message with "
                 "[YOUR PRODUCT NAME], [PRICE IN INR], and [YOUR SHOP INSTAGRAM HANDLE] "
                 "placeholders. Include one upsell reply and one discount-offer reply.",
        "count": 5,
        "bundle_type": "prompts",
        "is_premium": False,
        "platforms": ["shopify", "instagram"],
    },
    1: {  # Tuesday — Real Estate
        "niche": "5 WhatsApp follow-up messages a property broker sends when "
                 "a client visited a flat but hasn't replied in 3 days. Include "
                 "a polite check-in, a new-property suggestion, a price-drop alert, "
                 "a site-visit reminder, and a festive-greeting follow-up. Use "
                 "[CLIENT NAME], [PROPERTY NAME e.g. '2BHK in Baner'], "
                 "[YOUR NAME], and [YOUR AGENCY NAME] placeholders.",
        "count": 5,
        "bundle_type": "mixed",
        "is_premium": False,
        "platforms": ["whatsapp", "real-estate"],
    },
    2: {  # Wednesday — CA Firms
        "niche": "5 WhatsApp reminder messages a Chartered Accountant sends to "
                 "clients who haven't submitted their ITR documents before the "
                 "deadline. Include a gentle first reminder, an urgent 7-day "
                 "warning, a penalty-explanation message, a document-checklist "
                 "message, and a 'deadline extended' relief message. Use "
                 "[CLIENT NAME], [DUE DATE e.g. 'July 31'], [CA NAME], "
                 "and [FIRM NAME] placeholders.",
        "count": 5,
        "bundle_type": "mixed",
        "is_premium": True,
        "platforms": ["whatsapp", "email"],
    },
    3: {  # Thursday — Local Restaurants & Food
        "niche": "5 Instagram captions for a local Indian restaurant or home "
                 "baker posting daily food photos. Include a new-dish launch "
                 "caption, a weekend-special caption, a customer-review-share "
                 "caption, a behind-the-kitchen caption, and a festival-menu "
                 "caption. Each must have a hook first line, 3-5 Indian-audience "
                 "hashtags, and a CTA like 'DM to order' or 'Link in bio'. Use "
                 "[DISH NAME e.g. 'Paneer Tikka'], [PRICE e.g. '₹249'], "
                 "and [YOUR RESTAURANT NAME] placeholders.",
        "count": 5,
        "bundle_type": "prompts",
        "is_premium": False,
        "platforms": ["instagram"],
    },
    4: {  # Friday — WhatsApp Order Management
        "niche": "5 WhatsApp reply templates for an online store owner when a "
                 "customer asks 'where is my order?' Include a same-day delivery "
                 "update, a delayed-shipment apology, an out-for-delivery alert, "
                 "a delivered-confirmation check-in, and a refund-processed "
                 "message. Each must be under 500 characters and ready to paste "
                 "into WhatsApp Business Quick Replies. Use [CUSTOMER NAME], "
                 "[ORDER NUMBER e.g. '#TP-1234'], [PRODUCT NAME], "
                 "and [YOUR SHOP NAME] placeholders.",
        "count": 5,
        "bundle_type": "prompts",
        "is_premium": False,
        "platforms": ["whatsapp"],
    },
    5: {  # Saturday — LinkedIn B2B
        "niche": "3 cold LinkedIn connection-request messages for an Indian SaaS "
                 "founder reaching out to potential enterprise clients. One for "
                 "a CTO, one for a Head of Operations, one for a Procurement "
                 "Manager. Each under 300 characters (LinkedIn limit). Use "
                 "[THEIR NAME], [THEIR COMPANY], [YOUR PRODUCT NAME e.g. "
                 "'TiltedMCP'], and [YOUR NAME] placeholders.",
        "count": 3,
        "bundle_type": "prompts",
        "is_premium": True,
        "platforms": ["linkedin"],
    },
    6: {  # Sunday — Google Reviews
        "niche": "3 Google My Business review reply templates — one grateful "
                 "reply for a 5-star review, one professional reply for a 3-star "
                 "'it was okay' review, and one damage-control reply for a 1-star "
                 "angry review. Written for a local Indian business. Use "
                 "[CUSTOMER NAME], [YOUR BUSINESS NAME], and "
                 "[YOUR NAME / OWNER NAME] placeholders.",
        "count": 3,
        "bundle_type": "prompts",
        "is_premium": True,
        "platforms": ["google", "reviews"],
    },
}


# ---------------------------------------------------------------------------
# HMAC Signature Utilities
# ---------------------------------------------------------------------------

def _compute_hmac_signature(timestamp: str, body: str) -> str:
    """
    Compute HMAC-SHA256 signature for the ingestion request.

    The signature is computed over: "{timestamp}.{body}"
    using the INGEST_SECRET as the key.

    This prevents:
    - Replay attacks (timestamp checked server-side, 5-minute window)
    - Payload tampering (body is included in the signature)
    - Unauthorized access (only holders of INGEST_SECRET can sign)
    """
    message = f"{timestamp}.{body}"
    signature = hmac.new(
        INGEST_SECRET.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return signature


def _check_rate_limit() -> bool:
    """
    Enforce rate limiting: max MAX_INGESTIONS_PER_HOUR ingestions per hour.
    Returns True if the request is allowed, False if rate-limited.
    """
    now = time.time()
    one_hour_ago = now - 3600

    # Clean old timestamps
    _ingestion_timestamps[:] = [
        ts for ts in _ingestion_timestamps if ts > one_hour_ago
    ]

    if len(_ingestion_timestamps) >= MAX_INGESTIONS_PER_HOUR:
        return False

    _ingestion_timestamps.append(now)
    return True


# ---------------------------------------------------------------------------
# Core Functions
# ---------------------------------------------------------------------------

SIMPLICITY_DIRECTIVE = (
    "CRITICAL OUTPUT RULES — READ BEFORE GENERATING:\n"
    "1. Each prompt must be a FINISHED, READY-TO-USE message or template — "
    "NOT an instruction to 'create' or 'write' something. The user copies it, "
    "fills in the blanks, and sends it. That's it.\n"
    "2. All placeholders MUST use [CAPS IN BRACKETS] format with an example: "
    "[CUSTOMER NAME], [YOUR SHOP NAME], [PRICE e.g. '₹499']. "
    "NEVER use {{curly braces}} or <angle brackets> or {single braces}.\n"
    "3. Each prompt must solve ONE specific painful moment in the business "
    "owner's day — not a broad category.\n"
    "4. Write in the voice of a friendly Indian business owner — use 🙏, keep "
    "it warm, use first names. NOT 'Dear Valued Customer'.\n"
    "5. Keep WhatsApp messages under 500 characters. Keep Instagram captions "
    "under 2200 characters.\n"
    "6. The title of each prompt must say exactly what it is: "
    "'Late Delivery Apology Message' — NOT 'Customer Retention Template v2'."
)


def generate_bundle(
    niche: str,
    count: int = 5,
    bundle_type: str = "mixed",
    language: str = "English",
    tone: str = "friendly, like a helpful didi/bhaiya",
    extra_notes: str = "",
) -> dict:
    """
    Call the Flask bundle generator API to create a new prompt bundle.

    The SIMPLICITY_DIRECTIVE is automatically prepended to extra_notes to
    enforce zero-thinking, copy-paste-ready output from the LLM.

    Args:
        niche: The specific painful problem (not a broad category)
        count: Number of prompts to generate (1-25, default 5)
        bundle_type: One of "prompts", "gpt_instructions", "mixed"
        language: Output language (English, Hindi, Hinglish)
        tone: Writing tone — warm and approachable by default
        extra_notes: Additional context (simplicity directive auto-prepended)

    Returns:
        dict with keys: success, bundle_id, product_name, bundle, preview, files

    Raises:
        ConnectionError: If the Flask API is unreachable
        ValueError: If the API returns an error response
    """
    # Always prepend the simplicity directive
    full_notes = f"{SIMPLICITY_DIRECTIVE}\n\n{extra_notes}".strip()

    url = f"{FLASK_API_URL}/generate"
    payload = {
        "niche": niche,
        "count": min(max(count, 1), 25),  # Clamp to 1-25
        "bundle_type": bundle_type,
        "language": language,
        "tone": tone,
        "extra_notes": full_notes,
    }

    logger.info(
        f"Generating bundle: niche='{niche}', count={count}, type={bundle_type}"
    )

    try:
        resp = requests.post(url, json=payload, timeout=GENERATE_TIMEOUT)
    except requests.ConnectionError:
        raise ConnectionError(
            f"Flask API unreachable at {url}. "
            "Start it with: python bundle_generator.py"
        )
    except requests.Timeout:
        raise TimeoutError(
            f"Flask API timed out after {GENERATE_TIMEOUT}s. "
            "The LLM may be overloaded. Try reducing count or switching providers."
        )

    if resp.status_code == 502:
        raise ValueError(
            "LLM is not responding (502). Check that your local LLM is running "
            "or switch to DeepSeek by setting LLM_PROVIDER=deepseek in backend .env"
        )

    if resp.status_code == 422:
        error_data = resp.json()
        raise ValueError(
            f"LLM response could not be parsed as JSON: "
            f"{error_data.get('error', 'Unknown parsing error')}"
        )

    if resp.status_code != 200:
        raise ValueError(
            f"Flask API returned HTTP {resp.status_code}: {resp.text[:500]}"
        )

    result = resp.json()

    if not result.get("success"):
        raise ValueError(f"Generation failed: {result.get('error', 'Unknown error')}")

    logger.info(
        f"Bundle generated: '{result.get('product_name')}' "
        f"({result.get('preview', {}).get('prompt_count', '?')} prompts)"
    )

    return result


def validate_bundle(bundle: dict, expected_count: int) -> tuple[bool, list[str]]:
    """
    Validate a generated bundle meets quality AND simplicity standards.

    Checks both structural integrity and the Zero-Thinking rules:
    - No meta-prompts ("Create a...", "Write a...", "Generate a...")
    - No code-style placeholders ({{, }}, <variable>, {variable})
    - No overly short prompt texts (< 30 chars)
    - No textbook-style product names

    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors: list[str] = []

    # --- Structural checks ---

    prompts = bundle.get("prompts", [])
    if not prompts:
        errors.append("No prompts found in bundle")
    elif len(prompts) < expected_count * 0.8:
        errors.append(
            f"Too few prompts: got {len(prompts)}, "
            f"expected >= {int(expected_count * 0.8)}"
        )

    for i, prompt in enumerate(prompts):
        label = f"Prompt {i+1}"
        title = prompt.get("title", "").strip()
        text = prompt.get("prompt_text", "").strip()
        use_case = prompt.get("use_case", "").strip()

        if not title:
            errors.append(f"{label}: missing title")
        if not text:
            errors.append(f"{label}: missing prompt_text")
        if not use_case:
            errors.append(f"{label}: missing use_case")

        # --- SIMPLICITY CHECKS (Zero-Thinking Enforcement) ---

        # Reject meta-prompts: prompts that tell the user to "create" something
        # instead of giving them the finished thing
        meta_prefixes = [
            "create a", "write a", "generate a", "draft a",
            "compose a", "design a", "develop a", "produce a",
            "craft a", "formulate a",
        ]
        text_lower = text.lower()
        for prefix in meta_prefixes:
            if text_lower.startswith(prefix):
                errors.append(
                    f"{label}: SIMPLICITY FAIL — starts with '{prefix}...'. "
                    f"Must be a finished template, not an instruction."
                )
                break  # One failure per prompt is enough

        # Reject code-style placeholders
        if "{{" in text or "}}" in text:
            errors.append(
                f"{label}: SIMPLICITY FAIL — contains '{{{{}}}}' placeholders. "
                f"Must use [CAPS IN BRACKETS] format."
            )
        if "{" in text and "}" in text and "[" not in text:
            # Has {braces} but no [brackets] — likely code-style
            errors.append(
                f"{label}: SIMPLICITY FAIL — uses {{single braces}} instead "
                f"of [BRACKET PLACEHOLDERS]."
            )

        # Reject too-short prompts (vague one-liners)
        if text and len(text) < 30:
            errors.append(
                f"{label}: SIMPLICITY FAIL — prompt_text is only "
                f"{len(text)} chars. Too vague to be useful."
            )

    # --- Packaging checks ---

    packaging = bundle.get("packaging", {})
    product_name = packaging.get("product_name", "").strip()

    if not product_name:
        errors.append("Missing product_name in packaging")
    else:
        # Reject textbook-style names
        textbook_prefixes = [
            "comprehensive guide", "advanced toolkit", "ultimate handbook",
            "complete framework", "professional suite", "strategic",
        ]
        name_lower = product_name.lower()
        for prefix in textbook_prefixes:
            if prefix in name_lower:
                errors.append(
                    f"SIMPLICITY FAIL — product name '{product_name}' sounds "
                    f"like a textbook. Use plain language: '5 WhatsApp Messages "
                    f"for When Your Client Goes Silent'"
                )
                break

    if not packaging.get("description", "").strip():
        errors.append("Missing description in packaging")

    # --- Size check ---

    bundle_size = len(json.dumps(bundle).encode("utf-8"))
    if bundle_size > 500_000:
        errors.append(
            f"Bundle too large: {bundle_size} bytes (max 500,000)"
        )

    is_valid = len(errors) == 0
    return is_valid, errors


def transform_to_db_payload(
    bundle: dict,
    niche: str,
    bundle_type: str = "prompt_bundle",
    is_premium: bool = False,
    platforms: list[str] | None = None,
) -> dict:
    """
    Transform a Flask bundle generator response into the exact schema
    expected by the Supabase library_assets table.

    Args:
        bundle: The raw bundle dict from the Flask API
        niche: The niche used for generation
        bundle_type: The asset_type for the database
        is_premium: Whether this asset requires Pro tier
        platforms: List of platform tags (e.g., ["whatsapp", "instagram"])

    Returns:
        dict matching the library_assets table schema
    """
    packaging = bundle.get("packaging", {})
    tags_raw = packaging.get("tags", [])

    # Normalize tags: lowercase, deduplicate, limit to 10
    tags = list(dict.fromkeys(
        tag.lower().strip().replace(" ", "-")
        for tag in tags_raw
        if tag and tag.strip()
    ))[:10]

    # Extract platform tags from the niche if not provided
    if not platforms:
        platforms = []
        niche_lower = niche.lower()
        platform_keywords = {
            "whatsapp": ["whatsapp", "wa"],
            "instagram": ["instagram", "ig", "reels", "stories"],
            "shopify": ["shopify", "ecommerce", "e-commerce", "d2c"],
            "linkedin": ["linkedin"],
            "email": ["email", "gmail", "outreach"],
            "seo": ["seo", "blog", "content"],
            "real-estate": ["real estate", "property", "broker"],
        }
        for platform, keywords in platform_keywords.items():
            if any(kw in niche_lower for kw in keywords):
                platforms.append(platform)

    # Build the clean payload
    payload = {
        "title": packaging.get("product_name", f"Bundle: {niche[:50]}"),
        "description": packaging.get(
            "description",
            f"AI-generated prompt bundle for {niche}",
        ),
        "asset_type": "prompt_bundle",
        "platform": platforms,
        "content": bundle,  # Full bundle JSON stored as JSONB
        "tags": tags,
        "is_premium": is_premium,
    }

    return payload


def ingest_to_database(
    bundle: dict,
    metadata: dict,
) -> dict:
    """
    Push a transformed asset payload to the Next.js /api/ingest-bundle endpoint.

    Authentication uses HMAC-SHA256:
        Header X-Ingest-Key: the API key
        Header X-Ingest-Timestamp: current Unix epoch (seconds)
        Header X-Ingest-Signature: HMAC-SHA256(timestamp + "." + body, secret)

    Args:
        bundle: The raw bundle dict from Flask API
        metadata: Dict with keys: niche, bundle_type, is_premium, platforms (optional)

    Returns:
        dict with keys: success, asset_id, title

    Raises:
        PermissionError: If HMAC auth fails (401)
        ValueError: If payload validation fails (422) or duplicate (409)
        RuntimeError: If rate-limited (429) or server error (5xx)
    """
    # Rate limiting check
    if not _check_rate_limit():
        raise RuntimeError(
            f"Rate limit exceeded: max {MAX_INGESTIONS_PER_HOUR} ingestions/hour. "
            "Try again later."
        )

    # Validate credentials
    if not INGEST_KEY or not INGEST_SECRET:
        raise PermissionError(
            "Missing TILTEDPROMPTS_INGEST_KEY or TILTEDPROMPTS_INGEST_SECRET. "
            "Set these environment variables before running the generator."
        )

    # Transform the bundle into DB payload
    payload = transform_to_db_payload(
        bundle=bundle,
        niche=metadata.get("niche", ""),
        bundle_type=metadata.get("bundle_type", "prompt_bundle"),
        is_premium=metadata.get("is_premium", False),
        platforms=metadata.get("platforms"),
    )

    # Serialize for signing
    body_str = json.dumps(payload, separators=(",", ":"), sort_keys=True)
    timestamp = str(int(time.time()))
    signature = _compute_hmac_signature(timestamp, body_str)

    headers = {
        "Content-Type": "application/json",
        "X-Ingest-Key": INGEST_KEY,
        "X-Ingest-Timestamp": timestamp,
        "X-Ingest-Signature": signature,
    }

    logger.info(
        f"Ingesting asset: '{payload['title']}' → {INGEST_URL}"
    )

    try:
        resp = requests.post(
            INGEST_URL,
            data=body_str,  # Use pre-serialized body to match signature
            headers=headers,
            timeout=INGEST_TIMEOUT,
        )
    except requests.ConnectionError:
        raise ConnectionError(
            f"Ingestion API unreachable at {INGEST_URL}. "
            "Ensure the Next.js app is deployed and running."
        )
    except requests.Timeout:
        raise TimeoutError(
            f"Ingestion API timed out after {INGEST_TIMEOUT}s."
        )

    # Handle response codes
    if resp.status_code == 401:
        raise PermissionError(
            "HMAC authentication failed (401). "
            "Check INGEST_KEY and INGEST_SECRET environment variables."
        )

    if resp.status_code == 409:
        raise ValueError(
            f"Duplicate asset: an asset with title '{payload['title']}' "
            "already exists. Try a different niche qualifier."
        )

    if resp.status_code == 422:
        error_detail = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {"error": resp.text[:500]}
        raise ValueError(
            f"Payload validation failed (422): {error_detail}"
        )

    if resp.status_code == 429:
        raise RuntimeError(
            "Server-side rate limit hit (429). Queue asset and retry in 5 minutes."
        )

    if resp.status_code >= 500:
        raise RuntimeError(
            f"Server error ({resp.status_code}): {resp.text[:500]}"
        )

    if resp.status_code not in (200, 201):
        raise RuntimeError(
            f"Unexpected response ({resp.status_code}): {resp.text[:500]}"
        )

    result = resp.json()
    logger.info(
        f"Asset ingested successfully: ID={result.get('asset_id', 'unknown')}"
    )

    return result


# ---------------------------------------------------------------------------
# Orchestrator: Full Pipeline
# ---------------------------------------------------------------------------

def run_full_pipeline(
    niche: str,
    count: int = 10,
    bundle_type: str = "mixed",
    language: str = "English",
    is_premium: bool = False,
    platforms: list[str] | None = None,
    retry_on_failure: bool = True,
    post_status: bool = True,
) -> dict:
    """
    Execute the complete asset generation pipeline:
    1. Generate bundle via Flask API
    2. Validate the output
    3. Transform to DB schema
    4. Ingest to production database

    Each step posts a live status update via _post_slack_status() so
    the user sees real-time progress in Slack (Layer 1 + Layer 2).

    Args:
        niche: Target business vertical
        count: Number of prompts
        bundle_type: "prompts", "gpt_instructions", or "mixed"
        language: Output language
        is_premium: Gate behind Pro tier
        platforms: Platform tags for filtering
        retry_on_failure: If True, retry once on validation failure
        post_status: If True, post Slack status updates (default: True)

    Returns:
        dict with: success, asset_id, title, prompt_count, generation_time_seconds
    """
    start_time = time.time()
    attempt = 0
    max_attempts = 2 if retry_on_failure else 1

    while attempt < max_attempts:
        attempt += 1
        logger.info(f"Pipeline attempt {attempt}/{max_attempts} for niche='{niche}'")

        try:
            # Step 1: Generate
            if post_status:
                _post_slack_status(
                    f"{_RUNNING} Generating asset...\n"
                    f"{_pipeline_status_line(_RUNNING, _PENDING, _PENDING)}\n"
                    f"📋 Niche: {niche[:100]}",
                    agent="MSME",
                )

            gen_result = generate_bundle(
                niche=niche,
                count=count,
                bundle_type=bundle_type,
                language=language,
            )

            bundle = gen_result.get("bundle", {})

            # Step 2: Validate
            if post_status:
                _post_slack_status(
                    f"{_RUNNING} Validating output...\n"
                    f"{_pipeline_status_line(_OK, _RUNNING, _PENDING)}",
                    agent="MSME",
                )

            is_valid, errors = validate_bundle(bundle, expected_count=count)

            if not is_valid:
                logger.warning(
                    f"Validation failed (attempt {attempt}): {errors}"
                )
                if attempt < max_attempts:
                    logger.info("Retrying with adjusted parameters...")
                    count = max(count - 2, 3)  # Reduce count for retry
                    continue
                else:
                    elapsed = round(time.time() - start_time, 1)
                    fail_result = {
                        "success": False,
                        "error": f"Validation failed after {max_attempts} attempts",
                        "validation_errors": errors,
                        "generation_time_seconds": elapsed,
                    }
                    if post_status:
                        _post_slack_status(
                            _format_error_status(
                                error_msg="; ".join(errors[:3]),
                                error_type="ValidationError",
                                stage="validate",
                                elapsed=elapsed,
                                agent="MSME",
                            ),
                            agent="MSME",
                        )
                    return fail_result

            # Step 3 + 4: Ingest
            if post_status:
                _post_slack_status(
                    f"{_RUNNING} Uploading to TiltedPrompts Library...\n"
                    f"{_pipeline_status_line(_OK, _OK, _RUNNING)}",
                    agent="MSME",
                )

            db_result = ingest_to_database(
                bundle=bundle,
                metadata={
                    "niche": niche,
                    "bundle_type": bundle_type,
                    "is_premium": is_premium,
                    "platforms": platforms,
                },
            )

            elapsed = round(time.time() - start_time, 1)

            success_result = {
                "success": True,
                "asset_id": db_result.get("asset_id", "unknown"),
                "title": db_result.get("title", gen_result.get("product_name", "")),
                "prompt_count": len(bundle.get("prompts", [])),
                "is_premium": is_premium,
                "platforms": platforms or [],
                "generation_time_seconds": elapsed,
            }

            # ── Post final success status ────────────────────
            if post_status:
                _post_slack_status(
                    _format_success_status(
                        title=success_result["title"],
                        asset_id=success_result["asset_id"],
                        prompt_count=success_result["prompt_count"],
                        is_premium=is_premium,
                        elapsed=elapsed,
                        agent="MSME",
                        platforms=platforms,
                    ),
                    agent="MSME",
                )

            return success_result

        except (ConnectionError, TimeoutError, PermissionError) as e:
            # Non-retryable errors
            elapsed = round(time.time() - start_time, 1)
            fail_result = {
                "success": False,
                "error": str(e),
                "error_type": type(e).__name__,
                "generation_time_seconds": elapsed,
            }
            if post_status:
                _post_slack_status(
                    _format_error_status(
                        error_msg=str(e),
                        error_type=type(e).__name__,
                        stage="generate",
                        elapsed=elapsed,
                        agent="MSME",
                    ),
                    agent="MSME",
                )
            return fail_result

        except ValueError as e:
            # Potentially retryable
            if attempt < max_attempts:
                logger.warning(f"Retryable error (attempt {attempt}): {e}")
                continue
            elapsed = round(time.time() - start_time, 1)
            fail_result = {
                "success": False,
                "error": str(e),
                "error_type": "ValueError",
                "generation_time_seconds": elapsed,
            }
            if post_status:
                _post_slack_status(
                    _format_error_status(
                        error_msg=str(e),
                        error_type="ValueError",
                        stage="upload",
                        elapsed=elapsed,
                        agent="MSME",
                    ),
                    agent="MSME",
                )
            return fail_result

    # Should not reach here, but just in case
    return {"success": False, "error": "Exhausted all retry attempts"}


def run_cron_schedule() -> dict:
    """
    Execute the daily cron schedule.
    Determines today's niche from the rotation and runs the full pipeline.

    Returns:
        dict with: day, niche, results
    """
    today = datetime.now(timezone.utc).weekday()  # 0=Monday, 6=Sunday
    schedule = NICHE_SCHEDULE.get(today)

    if not schedule:
        logger.error(f"No schedule found for weekday {today}")
        return {"success": False, "error": f"No schedule for weekday {today}"}

    logger.info(
        f"Cron triggered: day={today} ({['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][today]}), "
        f"niche='{schedule['niche'][:60]}...'"
    )

    result = run_full_pipeline(
        niche=schedule["niche"],
        count=schedule["count"],
        bundle_type=schedule["bundle_type"],
        is_premium=schedule["is_premium"],
        platforms=schedule.get("platforms"),
    )

    return {
        "day": ["Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday", "Sunday"][today],
        "niche": schedule["niche"],
        "result": result,
    }


# ---------------------------------------------------------------------------
# CLI Interface
# ---------------------------------------------------------------------------

def main():
    """CLI entry point for direct invocation and cron jobs."""
    parser = argparse.ArgumentParser(
        description="TiltedPrompts Autonomous Asset Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run daily cron schedule
  python tools.py --cron

  # Generate specific bundle
  python tools.py generate --niche "Indian Real Estate" --count 5

  # Generate and mark as premium
  python tools.py generate --niche "CA Firms GST" --count 10 --premium

  # Test connection to Flask API
  python tools.py health
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Cron command
    parser.add_argument(
        "--cron",
        action="store_true",
        help="Run the daily cron schedule based on current day of week",
    )

    # Generate command
    gen_parser = subparsers.add_parser("generate", help="Generate a specific bundle")
    gen_parser.add_argument(
        "--niche", required=True, help="Target business niche"
    )
    gen_parser.add_argument(
        "--count", type=int, default=10, help="Number of prompts (default: 10)"
    )
    gen_parser.add_argument(
        "--bundle-type",
        choices=["prompts", "gpt_instructions", "mixed"],
        default="mixed",
        help="Bundle type (default: mixed)",
    )
    gen_parser.add_argument(
        "--language", default="English", help="Output language (default: English)"
    )
    gen_parser.add_argument(
        "--premium",
        action="store_true",
        help="Mark asset as premium (Pro tier only)",
    )
    gen_parser.add_argument(
        "--platforms",
        nargs="+",
        help="Platform tags (e.g., whatsapp instagram)",
    )

    # Health check command
    subparsers.add_parser("health", help="Check Flask API health")

    args = parser.parse_args()

    # Handle --cron flag
    if args.cron:
        logger.info("=" * 60)
        logger.info("CRON MODE: Starting daily asset generation")
        logger.info("=" * 60)
        result = run_cron_schedule()
        # Status already posted by run_full_pipeline via _post_slack_status
        sys.exit(0 if result.get("result", {}).get("success") else 1)

    # Handle subcommands
    if args.command == "health":
        try:
            resp = requests.get(f"{FLASK_API_URL}/health", timeout=10)
            health = resp.json()
            health_msg = (
                f"🏥 TiltedPrompts Health Check\n"
                f"\n"
                f"Flask API: ✅ OK\n"
                f"  Brand: {health.get('brand', 'unknown')}\n"
                f"  LLM Provider: {health.get('llm_provider', 'unknown')}"
            )

            # Also check ingestion endpoint
            try:
                ingest_resp = requests.get(
                    INGEST_URL.replace("/ingest-bundle", "/health"),
                    timeout=10,
                )
                ingest_ok = ingest_resp.ok
                health_msg += f"\nIngestion API: {'✅ OK' if ingest_ok else '❌ FAIL'}"
            except Exception:
                health_msg += f"\nIngestion API: ❌ UNREACHABLE ({INGEST_URL})"

            _post_slack_status(health_msg, agent="MSME")

        except Exception as e:
            _post_slack_status(
                f"🏥 TiltedPrompts Health Check\n\n"
                f"Flask API: ❌ UNREACHABLE ({FLASK_API_URL})\n"
                f"Error: {e}",
                agent="MSME",
            )
            sys.exit(1)

    elif args.command == "generate":
        logger.info("=" * 60)
        logger.info(f"MANUAL MODE: Generating for niche='{args.niche}'")
        logger.info("=" * 60)

        result = run_full_pipeline(
            niche=args.niche,
            count=args.count,
            bundle_type=args.bundle_type,
            language=args.language,
            is_premium=args.premium,
            platforms=args.platforms,
            post_status=True,  # Status is posted inside run_full_pipeline
        )
        # Status already posted by run_full_pipeline via _post_slack_status
        sys.exit(0 if result.get("success") else 1)

    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()
