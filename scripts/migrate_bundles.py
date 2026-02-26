#!/usr/bin/env python3
"""
TiltedPrompts — Bundle Migration Script
========================================
Reads all 65 bundle.json files from backend/bundles/ and generates:
  1. A SQL file (supabase_bundles.sql) for direct paste into Supabase SQL Editor
  2. A JSON file (bundles_payload.json) for use with the /api/ingest-bundle endpoint

Usage:
  python scripts/migrate_bundles.py

Output:
  - scripts/output/supabase_bundles.sql   (paste into Supabase SQL Editor)
  - scripts/output/bundles_payload.json   (for API ingestion if preferred)
  - scripts/output/migration_report.txt   (summary of what was processed)
"""

import json
import os
import sys
from pathlib import Path

# Paths
BUNDLES_DIR = Path(__file__).parent.parent / "backend" / "bundles"
OUTPUT_DIR = Path(__file__).parent / "output"

# Premium keywords - bundles with these in the title are always premium
ALWAYS_PREMIUM_KEYWORDS = [
    "pro pack", "pro-prompts", "success pack", "success kit",
    "enterprise", "pipeline", "blitz", "wizard", "goldmine"
]

# Always free keywords
ALWAYS_FREE_KEYWORDS = [
    "apology", "follow-up", "cover letter", "resignation",
    "self-assessment", "interview prep"
]

# Target: ~60% premium, ~40% free for healthy conversion funnel
# Every 5th bundle starting from 0 is free (indices 0, 5, 10, 15...)
FREE_EVERY_N = 3  # roughly every 3rd = 33% free

def classify_asset_type(bundle_data: dict, params_data: dict) -> str:
    """Determine the asset_type from bundle content."""
    bundle_type = params_data.get("bundle_type", "prompts")

    if bundle_type == "n8n_workflow":
        return "n8n_workflow"
    elif bundle_type == "openclaw_skill":
        return "openclaw_skill"
    elif bundle_type == "gpt_config":
        return "gpt_config"
    elif bundle_type == "code_template":
        return "code_template"
    elif bundle_type == "voice_agent":
        return "voice_agent"

    # Default: prompt_bundle
    return "prompt_bundle"


def extract_platforms(bundle_data: dict, params_data: dict) -> list:
    """Extract platform tags from bundle content."""
    platforms = set()

    niche = params_data.get("niche", "").lower()
    title = bundle_data.get("packaging", {}).get("product_name", "").lower()
    tags = bundle_data.get("packaging", {}).get("tags", [])

    all_text = f"{niche} {title} {' '.join(tags)}"

    platform_map = {
        "whatsapp": "whatsapp",
        "instagram": "instagram",
        "linkedin": "linkedin",
        "facebook": "facebook",
        "twitter": "twitter",
        "youtube": "youtube",
        "shopify": "shopify",
        "email": "email",
        "seo": "seo",
        "podcast": "podcast",
        "midjourney": "midjourney",
        "n8n": "n8n",
        "razorpay": "razorpay",
        "real estate": "real-estate",
        "saas": "saas",
        "ecommerce": "ecommerce",
        "e-commerce": "ecommerce",
    }

    for keyword, platform in platform_map.items():
        if keyword in all_text:
            platforms.add(platform)

    # Always add "content" as a generic platform
    if not platforms:
        platforms.add("content")

    return sorted(list(platforms))


def extract_tags(bundle_data: dict, params_data: dict) -> list:
    """Extract tags from packaging and params."""
    tags = set()

    # From packaging
    packaging_tags = bundle_data.get("packaging", {}).get("tags", [])
    for t in packaging_tags:
        tags.add(t.lower().strip())

    # From niche
    niche = params_data.get("niche", "")
    if niche:
        # Split niche into meaningful words
        for word in niche.lower().replace("-", " ").split():
            if len(word) > 3:
                tags.add(word)

    # Add language tag
    lang = params_data.get("language", "English")
    if lang.lower() != "english":
        tags.add(lang.lower())

    return sorted(list(tags))[:10]  # Cap at 10 tags


def escape_sql_string(s: str) -> str:
    """Escape a string for use in PostgreSQL standard SQL strings.

    Supabase uses standard_conforming_strings = on (PostgreSQL default),
    which means backslashes are LITERAL in regular strings — only single
    quotes need escaping ('' → '').  Do NOT double-escape backslashes.
    """
    if s is None:
        return ""
    return s.replace("'", "''")


def process_bundle(bundle_dir: Path, index: int) -> dict | None:
    """Process a single bundle directory and return asset data."""
    bundle_file = bundle_dir / "bundle.json"
    params_file = bundle_dir / "params.json"

    if not bundle_file.exists():
        return None

    try:
        with open(bundle_file, "r", encoding="utf-8") as f:
            bundle_data = json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"  SKIP {bundle_dir.name}: Invalid JSON — {e}")
        return None

    params_data = {}
    if params_file.exists():
        try:
            with open(params_file, "r", encoding="utf-8") as f:
                params_data = json.load(f)
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass  # Params are optional

    # Extract title
    title = bundle_data.get("packaging", {}).get("product_name", "")
    if not title:
        # Fallback: use first prompt title
        prompts = bundle_data.get("prompts", [])
        if prompts:
            title = prompts[0].get("title", bundle_dir.name)
        else:
            title = bundle_dir.name

    # Extract description
    description = bundle_data.get("packaging", {}).get("description", "")
    if not description:
        prompts = bundle_data.get("prompts", [])
        if prompts:
            description = prompts[0].get("description", f"AI-generated asset: {title}")
        else:
            description = f"AI-generated asset: {title}"

    # Truncate description if too long
    if len(description) > 500:
        description = description[:497] + "..."

    asset_type = classify_asset_type(bundle_data, params_data)
    platforms = extract_platforms(bundle_data, params_data)
    tags = extract_tags(bundle_data, params_data)

    # Determine premium status
    title_lower = title.lower()

    # Check forced categories first
    is_premium = True  # Default: premium
    if any(kw in title_lower for kw in ALWAYS_FREE_KEYWORDS):
        is_premium = False
    elif any(kw in title_lower for kw in ALWAYS_PREMIUM_KEYWORDS):
        is_premium = True
    else:
        # Alternating: every 3rd bundle is free
        is_premium = (index % FREE_EVERY_N) != 0

    return {
        "title": title.strip(),
        "description": description.strip(),
        "asset_type": asset_type,
        "platform": platforms,
        "content": bundle_data,  # Store the ENTIRE bundle as content
        "tags": tags,
        "is_premium": is_premium,
    }


def generate_sql(assets: list) -> str:
    """Generate SQL INSERT statements for all assets."""
    lines = []
    lines.append("-- ============================================================================")
    lines.append("-- TiltedPrompts — Bulk Bundle Import")
    lines.append(f"-- Generated: {len(assets)} assets from backend/bundles/")
    lines.append("-- ============================================================================")
    lines.append("-- IMPORTANT: Run supabase_production.sql FIRST to create tables.")
    lines.append("-- This script only INSERTs data. Duplicates are handled by ON CONFLICT.")
    lines.append("-- ============================================================================")
    lines.append("")

    for i, asset in enumerate(assets):
        title_esc = escape_sql_string(asset["title"])
        desc_esc = escape_sql_string(asset["description"])

        # Use dollar-quoting ($j$...$j$) for JSONB content to avoid ALL
        # escaping issues with backslashes, quotes, and special chars.
        # If content somehow contains '$j$', fall back to '$jj$...$jj$'.
        content_json = json.dumps(asset["content"], ensure_ascii=False)
        if "$j$" in content_json:
            dollar_tag = "$jj$"
        else:
            dollar_tag = "$j$"

        platform_arr = "ARRAY[" + ", ".join(f"'{p}'" for p in asset["platform"]) + "]" if asset["platform"] else "'{}'::TEXT[]"
        tags_arr = "ARRAY[" + ", ".join(f"'{escape_sql_string(t)}'" for t in asset["tags"]) + "]" if asset["tags"] else "'{}'::TEXT[]"
        premium = "true" if asset["is_premium"] else "false"

        lines.append(f"-- [{i+1}/{len(assets)}] {asset['title']}")
        lines.append(f"INSERT INTO public.library_assets (title, description, asset_type, platform, content, tags, is_premium)")
        lines.append(f"VALUES (")
        lines.append(f"    '{title_esc}',")
        lines.append(f"    '{desc_esc}',")
        lines.append(f"    '{asset['asset_type']}',")
        lines.append(f"    {platform_arr},")
        lines.append(f"    {dollar_tag}{content_json}{dollar_tag}::JSONB,")
        lines.append(f"    {tags_arr},")
        lines.append(f"    {premium}")
        lines.append(f") ON CONFLICT (title) DO NOTHING;")
        lines.append("")

    lines.append(f"-- Done! Inserted up to {len(assets)} assets.")
    lines.append("-- Verify: SELECT count(*), asset_type, is_premium FROM library_assets GROUP BY asset_type, is_premium ORDER BY asset_type;")

    return "\n".join(lines)


def main():
    print("=" * 60)
    print("TiltedPrompts — Bundle Migration Script")
    print("=" * 60)

    if not BUNDLES_DIR.exists():
        print(f"ERROR: Bundles directory not found: {BUNDLES_DIR}")
        sys.exit(1)

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all bundle directories (skip files starting with _)
    bundle_dirs = sorted([
        d for d in BUNDLES_DIR.iterdir()
        if d.is_dir() and not d.name.startswith("_")
    ])

    print(f"\nFound {len(bundle_dirs)} bundle directories")
    print("-" * 60)

    assets = []
    skipped = []

    for i, bundle_dir in enumerate(bundle_dirs):
        asset = process_bundle(bundle_dir, i)
        if asset:
            assets.append(asset)
            premium_flag = "PRO" if asset["is_premium"] else "FREE"
            print(f"  [{premium_flag}] {asset['title']}")
        else:
            skipped.append(bundle_dir.name)
            print(f"  [SKIP] {bundle_dir.name}")

    print("-" * 60)
    print(f"\nProcessed: {len(assets)} assets")
    print(f"Skipped:   {len(skipped)} directories")

    free_count = sum(1 for a in assets if not a["is_premium"])
    pro_count = sum(1 for a in assets if a["is_premium"])
    print(f"Free:      {free_count}")
    print(f"Premium:   {pro_count}")

    # Generate SQL
    sql = generate_sql(assets)
    sql_file = OUTPUT_DIR / "supabase_bundles.sql"
    with open(sql_file, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"\nSQL file:  {sql_file}")

    # Generate JSON payloads (for API ingestion)
    json_payloads = []
    for asset in assets:
        payload = {
            "title": asset["title"],
            "description": asset["description"],
            "asset_type": asset["asset_type"],
            "platform": asset["platform"],
            "content": asset["content"],
            "tags": asset["tags"],
            "is_premium": asset["is_premium"],
        }
        json_payloads.append(payload)

    json_file = OUTPUT_DIR / "bundles_payload.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(json_payloads, f, indent=2, ensure_ascii=False)
    print(f"JSON file: {json_file}")

    # Generate report
    report_lines = [
        "TiltedPrompts Bundle Migration Report",
        "=" * 40,
        f"Total bundles processed: {len(assets)}",
        f"Free assets: {free_count}",
        f"Premium assets: {pro_count}",
        f"Skipped: {len(skipped)}",
        "",
        "Asset Type Breakdown:",
    ]

    type_counts = {}
    for a in assets:
        type_counts[a["asset_type"]] = type_counts.get(a["asset_type"], 0) + 1
    for atype, count in sorted(type_counts.items()):
        report_lines.append(f"  {atype}: {count}")

    report_lines.append("")
    report_lines.append("All Assets:")
    for i, a in enumerate(assets):
        flag = "PRO" if a["is_premium"] else "FREE"
        report_lines.append(f"  {i+1}. [{flag}] {a['title']} ({a['asset_type']})")

    if skipped:
        report_lines.append("")
        report_lines.append("Skipped directories:")
        for s in skipped:
            report_lines.append(f"  - {s}")

    report_file = OUTPUT_DIR / "migration_report.txt"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    print(f"Report:    {report_file}")

    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("  1. Run supabase_production.sql in Supabase SQL Editor (creates tables)")
    print("  2. Run supabase_bundles.sql in Supabase SQL Editor (imports bundles)")
    print("  3. Visit /members to verify assets appear in the dashboard")
    print("=" * 60)


if __name__ == "__main__":
    main()
