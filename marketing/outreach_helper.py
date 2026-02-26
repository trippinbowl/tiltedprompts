"""
tiltedprompts – Outreach Helper

Human-in-the-loop script that generates personalized outreach
messages for LinkedIn/Reddit posts.

Usage:
  python outreach_helper.py --url "https://linkedin.com/posts/..."  --niche "D2C marketing"
  python outreach_helper.py --url "https://reddit.com/r/..."       --topic "AI for small business"

The script generates a suggested comment/DM but NEVER auto-posts.
It prints the message for you to review, edit, and manually post.
"""
import argparse
import json
import sys
from pathlib import Path

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))
from llm_provider import generate_with_llm
import config

OUTREACH_SYSTEM_PROMPT = f"""You are a helpful outreach assistant for {config.BRAND_NAME}.
Your goal is to generate genuine, non-spammy, value-first comments and DMs
that naturally mention free AI prompts available at {config.BRAND_NAME}.

Rules:
- Be genuinely helpful and relevant to the post/thread
- DO NOT be salesy or pushy
- Lead with value, mention the free resource naturally
- Keep it under 100 words for comments, 150 words for DMs
- Use a casual, peer-to-peer tone
- Never use fake urgency or clickbait
- Include 1 actionable tip related to the post topic"""


def generate_outreach(url: str, platform: str, niche: str, context: str = "", msg_type: str = "comment") -> str:
    """Generate a personalized outreach message."""
    prompt = f"""Generate a {msg_type} for a {platform} post.

POST URL: {url}
NICHE/TOPIC: {niche}
ADDITIONAL CONTEXT: {context if context else "None provided"}

The {msg_type} should:
1. Respond to the post topic genuinely
2. Share 1 quick actionable tip relevant to {niche}
3. Naturally mention that you have a free set of AI prompts for {niche}
4. Include a soft call to action like "happy to share if helpful"

DO NOT include any links (I'll add those manually).
Format: just the {msg_type} text, nothing else."""

    return generate_with_llm(prompt=prompt, system_msg=OUTREACH_SYSTEM_PROMPT, temperature=0.9)


def detect_platform(url: str) -> str:
    """Detect platform from URL."""
    if "linkedin" in url.lower():
        return "LinkedIn"
    elif "reddit" in url.lower():
        return "Reddit"
    elif "twitter" in url.lower() or "x.com" in url.lower():
        return "Twitter/X"
    elif "instagram" in url.lower():
        return "Instagram"
    else:
        return "Social Media"


def main():
    parser = argparse.ArgumentParser(description=f"{config.BRAND_NAME} Outreach Helper")
    parser.add_argument("--url", required=True, help="URL of the post to respond to")
    parser.add_argument("--niche", default="Indian SMB marketing", help="Topic/niche context")
    parser.add_argument("--context", default="", help="Extra context about the post")
    parser.add_argument("--type", choices=["comment", "dm"], default="comment", help="Message type")
    args = parser.parse_args()

    platform = detect_platform(args.url)

    print(f"\n{'='*50}")
    print(f"  {config.BRAND_NAME} Outreach Helper")
    print(f"{'='*50}")
    print(f"  Platform: {platform}")
    print(f"  URL: {args.url}")
    print(f"  Niche: {args.niche}")
    print(f"  Type: {args.type}")
    print(f"{'='*50}\n")
    print("⏳ Generating outreach message...\n")

    try:
        message = generate_outreach(
            url=args.url,
            platform=platform,
            niche=args.niche,
            context=args.context,
            msg_type=args.type,
        )

        print(f"{'─'*50}")
        print(f"📝 Suggested {args.type.upper()}:")
        print(f"{'─'*50}")
        print(f"\n{message}\n")
        print(f"{'─'*50}")
        print(f"\n⚠️  Review the message above carefully.")
        print(f"📋 Copy and paste it manually — DO NOT auto-post.")
        print(f"✏️  Edit to add personal touch before posting.\n")

    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"💡 Make sure your LLM is running (local) or DEEPSEEK_API_KEY is set.")
        sys.exit(1)


if __name__ == "__main__":
    main()
