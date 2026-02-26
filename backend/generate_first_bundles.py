"""
tiltedprompts – Generate First 3 Revenue Bundles

Run with the Flask server running on port 5000:
  python generate_first_bundles.py

This creates 3 high-demand bundles optimized for Indian SMBs on Gumroad.
Each bundle targets a different niche for maximum coverage.
"""
import json
import time
import requests

BASE_URL = "http://localhost:5000"

BUNDLES = [
    {
        "name": "Bundle 1: WhatsApp Marketing",
        "payload": {
            "niche": "WhatsApp Business marketing for Indian retail shops, restaurants, and local services",
            "bundle_type": "mixed",
            "count": 15,
            "language": "English with Hindi phrases where natural",
            "tone": "friendly, practical, conversational",
            "extra_notes": (
                "Focus on: broadcast message templates, festival promotions (Diwali, Holi, Eid), "
                "customer follow-up messages, new product announcements, loyalty program messages, "
                "Google review requests, delivery updates, and catalog sharing messages. "
                "Include GPT instructions for generating unlimited variations. "
                "Every prompt must be copy-paste ready for WhatsApp Business. "
                "Add placeholders like [Shop Name], [Product], [Offer], [Festival] so users can personalize instantly."
            ),
        },
        "gumroad_price": "$4.99",
        "gumroad_title": "15 WhatsApp Marketing Prompts for Indian Retailers",
        "gumroad_desc": "Copy-paste ready WhatsApp messages for promotions, festivals, follow-ups & more. Works with any local business.",
    },
    {
        "name": "Bundle 2: Instagram & Social Media Content",
        "payload": {
            "niche": "Instagram and social media content creation for Indian D2C brands and small businesses",
            "bundle_type": "mixed",
            "count": 15,
            "language": "English",
            "tone": "engaging, trendy, brand-building",
            "extra_notes": (
                "Focus on: Instagram captions, Reels scripts, carousel post ideas, story engagement prompts, "
                "product launch announcements, behind-the-scenes content ideas, customer testimonial templates, "
                "hashtag strategy prompts, bio optimization, and content calendar generation. "
                "Include GPT instructions for creating a week's worth of content in one go. "
                "Make prompts work for fashion, food, beauty, home decor, and wellness brands. "
                "Add placeholders like [Brand Name], [Product Category], [Target Audience]."
            ),
        },
        "gumroad_price": "$6.99",
        "gumroad_title": "15 Instagram & Social Media Prompts for Indian D2C Brands",
        "gumroad_desc": "Reels scripts, captions, carousel ideas & content calendars. Built for Indian D2C and small brands.",
    },
    {
        "name": "Bundle 3: Sales Emails & Cold Outreach",
        "payload": {
            "niche": "Sales emails, cold outreach, and client communication for Indian B2B service businesses and freelancers",
            "bundle_type": "mixed",
            "count": 15,
            "language": "English",
            "tone": "professional yet warm, consultative",
            "extra_notes": (
                "Focus on: cold email templates (first touch, follow-up, breakup), "
                "proposal cover emails, project kickoff messages, invoice follow-ups, "
                "client onboarding sequences, testimonial requests, referral asks, "
                "LinkedIn connection messages, and meeting scheduling emails. "
                "Include GPT instructions for personalizing emails at scale. "
                "Optimize for Indian business culture — respectful, relationship-first, no aggressive tactics. "
                "Add placeholders like [Company Name], [Service], [Client Name], [Project Type]."
            ),
        },
        "gumroad_price": "$4.99",
        "gumroad_title": "15 Sales Email & Outreach Prompts for Indian Freelancers & Agencies",
        "gumroad_desc": "Cold emails, follow-ups, proposals & client comms. Built for Indian service businesses.",
    },
]


def generate_bundle(bundle_info: dict) -> dict | None:
    """Generate a single bundle via the API."""
    print(f"\n{'='*60}")
    print(f"  🔨 Generating: {bundle_info['name']}")
    print(f"  💰 Suggested Gumroad price: {bundle_info['gumroad_price']}")
    print(f"{'='*60}")

    start = time.time()
    try:
        r = requests.post(
            f"{BASE_URL}/generate",
            json=bundle_info["payload"],
            timeout=300,  # 5 min timeout for 15 prompts
        )
        elapsed = time.time() - start

        if r.status_code == 200:
            data = r.json()
            if data.get("success"):
                print(f"  ✅ Generated in {elapsed:.0f}s")
                print(f"  📦 Product: {data.get('product_name')}")
                print(f"  📝 Prompts: {data['preview']['prompt_count']}")
                print(f"  📁 JSON: {data['files']['json']}")
                print(f"  📁 Markdown: {data['files']['markdown']}")
                print(f"  🏷️ Tags: {', '.join(data['preview'].get('tags', []))}")
                return data
            else:
                print(f"  ❌ Response missing 'success': {json.dumps(data, indent=2)[:300]}")
        elif r.status_code == 422:
            data = r.json()
            print(f"  ❌ JSON parse failed: {data.get('error')}")
            if data.get("debug_file"):
                print(f"  📄 Raw response saved: {data['debug_file']}")
        else:
            print(f"  ❌ HTTP {r.status_code}: {r.text[:300]}")

    except requests.Timeout:
        print(f"  ❌ Timed out (300s)")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    return None


def main():
    # Check server
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=3)
        print(f"✅ Server running ({r.json().get('llm_provider')} LLM)")
    except Exception:
        print(f"❌ Server not running! Start it: python bundle_generator.py")
        return

    results = []
    for bundle in BUNDLES:
        result = generate_bundle(bundle)
        results.append((bundle, result))
        if result:
            time.sleep(2)  # brief pause between generations

    # Summary
    print(f"\n{'='*60}")
    print(f"  📊 GENERATION SUMMARY")
    print(f"{'='*60}")

    success_count = 0
    for bundle, result in results:
        if result:
            success_count += 1
            print(f"\n  ✅ {bundle['name']}")
            print(f"     Gumroad title: {bundle['gumroad_title']}")
            print(f"     Gumroad price: {bundle['gumroad_price']}")
            print(f"     Gumroad desc:  {bundle['gumroad_desc']}")
            print(f"     Files: {result['files']['json']}")
            print(f"            {result['files']['markdown']}")
        else:
            print(f"\n  ❌ {bundle['name']} — FAILED (re-run to retry)")

    print(f"\n  {success_count}/3 bundles generated")

    if success_count > 0:
        print(f"\n{'='*60}")
        print(f"  🚀 NEXT STEPS")
        print(f"{'='*60}")
        print(f"  1. Review the .md files in backend/bundles/")
        print(f"  2. Create a Gumroad account at https://gumroad.com")
        print(f"  3. Upload each bundle .md as a digital product")
        print(f"  4. Set prices as suggested above")
        print(f"  5. Copy the Gumroad webhook URL to your .env")
        print(f"  6. Share the lead magnet on LinkedIn/Twitter")


if __name__ == "__main__":
    main()
