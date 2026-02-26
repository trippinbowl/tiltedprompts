"""
TiltedPrompts — Framework Generator Tools (v2: Overnight Batch Engine)

Generates structured, high-value framework prompts at SCALE. Runs an
overnight batch of 50 unique assets per commercial category, rotating
through 7 verticals across the week.

Architecture:
    Cron (10 PM IST) → _build_task_variations() → 50x loop:
        generate_framework() → Flask API → LLM
        validate_framework() → quality gate
        ingest_to_database() → Next.js API → Supabase
        time.sleep(adaptive) → span the 7-hour overnight window

Trigger via Slack:  @Claw framework [task description]
Trigger via cron:   python tools.py --cron
Trigger via CLI:    python tools.py framework --task "..." --count 3

HOW TO SCALE:
    - Change CRON_BATCH_SIZE to generate more/fewer assets per night
    - Change CRON_WINDOW_HOURS to match your overnight window
    - Add sub_niches/industries to any day for more variety
    - Each day supports sub_niches × industries combinations
      (20 × 25 = 500 unique combos per day >> 50 needed)

This is Agent 2 of 2. Agent 1 (tilted_asset_generator) handles MSME templates.
"""

import argparse
import itertools
import json
import logging
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from typing import Any

# ---------------------------------------------------------------------------
# Import shared infrastructure from the MSME agent
# ---------------------------------------------------------------------------
# Both agents share: Flask API caller, HMAC signing, ingestion, rate limiting.

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tilted_generator"))

from tools import (
    FLASK_API_URL,
    INGEST_URL,
    INGEST_KEY,
    INGEST_SECRET,
    GENERATE_TIMEOUT,
    INGEST_TIMEOUT,
    _compute_hmac_signature,
    _check_rate_limit,
    ingest_to_database,
    transform_to_db_payload,
)
import requests


# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  CONFIGURATION — EDIT THESE TO SCALE                                    ║
# ║                                                                         ║
# ║  All values can be overridden via environment variables OR CLI flags.    ║
# ║  CLI flags take highest priority, then env vars, then these defaults.   ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

CRON_BATCH_SIZE = int(os.getenv("FRAMEWORK_BATCH_SIZE", "50"))
CRON_WINDOW_HOURS = float(os.getenv("FRAMEWORK_WINDOW_HOURS", "7"))
ESTIMATED_GEN_SECONDS = int(os.getenv("FRAMEWORK_EST_GEN_SECS", "180"))
CRON_MIN_SLEEP = int(os.getenv("FRAMEWORK_MIN_SLEEP", "60"))

LOG_DIR = os.getenv(
    "TILTEDPROMPTS_LOG_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs"),
)

DAY_NAMES = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday",
]

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("tilted_framework")


# ---------------------------------------------------------------------------
# FRAMEWORK DIRECTIVE — The soul of this agent
# ---------------------------------------------------------------------------

FRAMEWORK_DIRECTIVE = (
    "CRITICAL OUTPUT RULES — FRAMEWORK MODE — READ BEFORE GENERATING:\n\n"
    "You are generating STRUCTURED FRAMEWORK PROMPTS, not simple messages.\n"
    "Every prompt you produce is a technical blueprint that the user will\n"
    "copy-paste directly into an LLM, image generator, or automation tool.\n\n"
    "RULE 1 — CAPITALIZED SECTION HEADERS:\n"
    "Every prompt MUST be organized using ALL-CAPS section labels followed\n"
    "by a colon. Examples: ROLE:, OBJECTIVE:, CONTEXT:, INPUT FORMAT:,\n"
    "OUTPUT FORMAT:, CONSTRAINTS:, STYLE:, ASPECT RATIO:, SUBJECT:,\n"
    "BACKGROUND:, COMPOSITION RULES:, STEPS:, ERROR HANDLING:.\n"
    "Each prompt must contain AT LEAST 4 such headers.\n\n"
    "RULE 2 — ZERO CONVERSATIONAL FILLER:\n"
    "No 'please', no 'could you', no 'I want you to', no 'I'd like'.\n"
    "Write like you are programming a highly advanced robot.\n"
    "Direct. Precise. Clinical. Every word earns its place.\n"
    "YES: 'ROLE: Senior financial analyst specializing in MSME reporting.'\n"
    "NO: 'You are a helpful assistant that can help with financial reports.'\n\n"
    "RULE 3 — [BRACKETED] PLACEHOLDERS WITH EXAMPLES:\n"
    "All user-configurable values use [CAPS IN BRACKETS] with a concrete\n"
    "example: [COMPANY NAME, e.g., 'TiltedPrompts'], [BRAND COLOR, e.g., '#6C5CE7'].\n"
    "NEVER use {{curly braces}} or <angle brackets> or {single braces}.\n\n"
    "RULE 4 — NO META-PROMPTS:\n"
    "You are generating the ACTUAL blueprint the user pastes into their tool.\n"
    "NOT instructions about how to write a prompt. The output IS the artifact.\n\n"
    "RULE 5 — MINIMUM DENSITY:\n"
    "Each prompt must be at least 200 characters. Framework prompts are rich,\n"
    "detailed specifications — not one-liners."
)


# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  NICHE SCHEDULE — 7 COMMERCIAL CATEGORIES                              ║
# ║                                                                         ║
# ║  HOW TO EDIT:                                                           ║
# ║    - To add a sub-niche: append a string to the "sub_niches" list       ║
# ║    - To add an industry: append a string to the "industries" list       ║
# ║    - To change prompts per bundle: edit "count" (3 is standard)         ║
# ║    - To change platform tags: edit the "platforms" list                 ║
# ║    - The {SUB_NICHE} and {INDUSTRY} tokens in base_task get replaced    ║
# ║      automatically by _build_task_variations()                          ║
# ║    - More entries in sub_niches × industries = more unique combinations ║
# ║      (target: at least 500 combos per day for 50-asset batches)         ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

NICHE_SCHEDULE: dict[int, dict[str, Any]] = {

    # ═══════════════════════════════════════════════════════════════════
    # MONDAY — Content & Copywriting
    # ═══════════════════════════════════════════════════════════════════
    0: {
        "category": "Content & Copywriting",
        "base_task": (
            "3 structured ChatGPT/Claude prompts for generating "
            "{SUB_NICHE} targeting the {INDUSTRY} industry. "
            "Each prompt must include ROLE:, OBJECTIVE:, TARGET AUDIENCE:, "
            "TONE:, STRUCTURE:, OUTPUT FORMAT:, WORD COUNT:, "
            "SEO GUIDELINES:, and CONSTRAINTS: section headers. "
            "Use [COMPANY NAME], [TARGET KEYWORD, e.g., 'cloud migration strategy'], "
            "[AUDIENCE PERSONA, e.g., 'mid-level IT managers at enterprises "
            "with 500+ employees'], and [CTA, e.g., 'Book a free consultation'] "
            "placeholders."
        ),
        "sub_niches": [
            "SEO-optimized long-form blog posts with internal linking strategy",
            "conversational podcast episode outlines with guest talking points and timestamps",
            "weekly email newsletter sequences with subject line A/B variants",
            "high-converting landing page copy with above-the-fold hooks",
            "customer case study frameworks with quantified ROI results",
            "e-commerce product description generators with benefit-first structure",
            "6-email lead nurture sequences for cold-to-warm conversion",
            "60-minute webinar scripts with slide-by-slide content breakdown",
            "YouTube video scripts using hook-story-offer structure",
            "30-day social media content calendars with daily posting themes",
            "press release templates for product launches and funding rounds",
            "brand storytelling narrative frameworks using hero's journey arc",
            "thought leadership LinkedIn article outlines with data hooks",
            "product comparison guides with feature-by-feature decision matrices",
            "FAQ content generators derived from real customer support tickets",
            "technical whitepaper outlines with executive summary and methodology",
            "content brief generators for outsourced freelance writers",
            "editorial calendar prompts with seasonal and trend-based hooks",
            "content repurposing frameworks turning 1 pillar into 10 micro-assets",
            "video transcript to blog post conversion prompts with SEO layering",
        ],
        "industries": [
            "B2B SaaS", "HealthTech", "FinTech", "EdTech",
            "Real Estate", "E-commerce / D2C", "Legal Tech",
            "HR Tech / Recruiting", "Logistics & Supply Chain",
            "Insurance", "Crypto / Web3", "AgriTech",
            "Travel & Hospitality", "Food & Beverage", "Fitness & Wellness",
            "Automotive", "Construction", "Media & Entertainment",
            "Nonprofit / NGO", "Cybersecurity", "Clean Energy / CleanTech",
            "Retail", "Pharmaceutical", "Telecom", "Gaming & Esports",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["chatgpt", "claude", "content", "seo", "copywriting"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # TUESDAY — Marketing & Advertising
    # ═══════════════════════════════════════════════════════════════════
    1: {
        "category": "Marketing & Advertising",
        "base_task": (
            "3 structured marketing framework prompts for {SUB_NICHE} "
            "in the {INDUSTRY} sector. Each must include OBJECTIVE:, "
            "TARGET AUDIENCE:, CHANNEL:, MESSAGING FRAMEWORK:, "
            "COPY VARIANTS:, CTA OPTIONS:, A/B TEST HYPOTHESES:, "
            "and PERFORMANCE METRICS: section headers. "
            "Use [BRAND NAME], [PRODUCT NAME, e.g., 'TiltedMCP Pro'], "
            "[CAMPAIGN BUDGET, e.g., '$5,000/month'], and "
            "[LANDING PAGE URL] placeholders."
        ),
        "sub_niches": [
            "curiosity-hook email subject lines with open-rate optimization",
            "hyper-personalized drip email sequences using dynamic merge fields",
            "Facebook ad copy frameworks with hook-problem-solution-CTA structure",
            "Google Ads responsive search ad copy with keyword insertion patterns",
            "LinkedIn Sponsored Content ad frameworks for B2B lead generation",
            "retargeting ad sequence builders with frequency-cap logic",
            "influencer outreach collaboration pitch templates with rate cards",
            "product launch campaign planners with 14-day countdown sequence",
            "seasonal promotion campaign blueprints with urgency and scarcity triggers",
            "detailed customer persona builders from Google Analytics data",
            "brand positioning statement generators with competitive differentiation",
            "competitive messaging matrix frameworks with objection handling",
            "UTM parameter strategy planners for multi-channel attribution tracking",
            "referral program launch copy and tiered incentive structure prompts",
            "affiliate marketing pitch decks with commission structure proposals",
            "event and conference promotion multi-channel email sequences",
            "PR pitch frameworks for journalist and media outlet outreach",
            "crisis communication response plan generators with stakeholder messaging",
            "brand voice and tone guideline document generators",
            "marketing ROI calculator prompts from raw ad-spend CSV data",
        ],
        "industries": [
            "B2B SaaS", "E-commerce / D2C", "FinTech", "HealthTech",
            "Real Estate", "EdTech", "Crypto / Web3", "Fitness & Wellness",
            "Travel & Hospitality", "Food & Beverage", "Fashion & Apparel",
            "Automotive", "Insurance", "HR Tech / Recruiting",
            "Gaming & Esports", "Beauty & Personal Care", "Home & Garden",
            "Pet Care", "Subscription Boxes", "Luxury Brands",
            "Local Services", "Professional Services", "Telecom",
            "Consumer Electronics", "Sustainability / Green Brands",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["chatgpt", "claude", "marketing", "advertising", "email"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # WEDNESDAY — Image Generation (Midjourney)
    # ═══════════════════════════════════════════════════════════════════
    2: {
        "category": "Image Generation — Midjourney",
        "base_task": (
            "3 structured Midjourney v6 / DALL-E 3 prompts for "
            "{SUB_NICHE} in a {INDUSTRY} context. Each prompt must "
            "include ASPECT RATIO:, STYLE:, SUBJECT:, LIGHTING:, "
            "BACKGROUND:, COLOR PALETTE:, COMPOSITION RULES:, "
            "MOOD:, CAMERA ANGLE:, and NEGATIVE PROMPT: section headers. "
            "Use [PRODUCT DESCRIPTION, e.g., 'minimalist productivity app "
            "dashboard'], [BRAND COLOR, e.g., '#6C5CE7'], and "
            "[SCENE CONTEXT] placeholders."
        ),
        "sub_niches": [
            "photorealistic product hero shots on dark gradient backgrounds",
            "cinematic portrait photography with dramatic split rim lighting",
            "architectural visualization renders for modern minimalist interiors",
            "editorial food photography with overhead flat-lay composition",
            "fashion lookbook shots with natural studio lighting and muted tones",
            "brand identity mockup scenes with stationery and packaging spread",
            "social media ad graphics with bold typography negative space",
            "book cover and album artwork with conceptual symbolic imagery",
            "app UI screenshot mockups embedded in floating device frames",
            "interior design mood board compositions with material samples",
            "aerial landscape and cityscape drone photography",
            "abstract geometric art for SaaS website hero backgrounds",
            "event and conference promotional wide-format banner graphics",
            "packaging design visualization with 3D product label renders",
            "automotive and vehicle studio photography with reflective floors",
            "jewelry and luxury goods macro photography with bokeh backgrounds",
            "real estate listing photos with AI virtual staging",
            "fitness and sports action photography with motion blur effects",
            "tech gadget unboxing and lifestyle flat-lay shots",
            "isometric 3D illustrations for SaaS feature explanation pages",
        ],
        "industries": [
            "SaaS / Tech Startup", "E-commerce / D2C", "Real Estate",
            "Food & Restaurant", "Fashion & Apparel", "Fitness & Wellness",
            "Automotive", "Travel & Hospitality", "Beauty & Cosmetics",
            "Architecture & Interior Design", "Jewelry & Luxury Goods",
            "Gaming & Entertainment", "Music & Events",
            "Publishing & Media", "Health & Medical",
            "Education & eLearning", "Finance & Banking",
            "Sports & Athletics", "Pet & Animal Care",
            "Craft & Handmade", "Wedding & Celebration",
            "Environmental / Nature", "Science Fiction / Futuristic",
            "Cyberpunk / Neon Aesthetic", "Vintage / Retro Film Aesthetic",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["midjourney", "dalle", "design", "image-generation"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # THURSDAY — Sales & Cold Outreach
    # ═══════════════════════════════════════════════════════════════════
    3: {
        "category": "Sales & Cold Outreach",
        "base_task": (
            "3 structured outreach framework prompts for {SUB_NICHE} "
            "targeting {INDUSTRY} decision-makers. Each must include "
            "ROLE:, OBJECTIVE:, BUYER PERSONA:, PAIN POINTS:, "
            "VALUE PROPOSITION:, MESSAGE STRUCTURE:, FOLLOW-UP CADENCE:, "
            "OBJECTION HANDLING:, and CTA: section headers. "
            "Use [PROSPECT NAME], [PROSPECT COMPANY, e.g., 'Infosys'], "
            "[YOUR PRODUCT, e.g., 'TiltedMCP'], and "
            "[RECENT TRIGGER EVENT, e.g., 'their Series B funding round'] "
            "placeholders."
        ),
        "sub_niches": [
            "hyper-personalized LinkedIn connection request messages under 300 chars",
            "5-touch cold email sequences with value-first subject lines",
            "post-demo follow-up cadences with embedded social proof",
            "breakup email frameworks for non-responsive prospects after 5 touches",
            "warm referral request messages to mutual LinkedIn connections",
            "strategic partnership and co-marketing proposal outreach",
            "upsell and cross-sell conversation scripts for account managers",
            "demo booking sequences with one-click calendar link CTAs",
            "post-conference and event networking follow-up frameworks",
            "executive-level C-suite outreach with board-room tone",
            "investor pitch cold email sequences for seed/Series A fundraising",
            "customer win-back campaigns for accounts churned in last 90 days",
            "case study co-creation and testimonial request outreach",
            "contract renewal and expansion conversation frameworks",
            "pricing negotiation scripts with psychological anchoring techniques",
            "objection handling playbooks for the top 10 common sales blockers",
            "discovery call question frameworks for BANT/MEDDIC qualification",
            "proposal and SOW cover letter templates with ROI projections",
            "channel partner and reseller recruitment outreach sequences",
            "procurement and RFP response cover letter frameworks",
        ],
        "industries": [
            "Enterprise SaaS", "FinTech", "HealthTech", "EdTech",
            "Cybersecurity", "Cloud Infrastructure (AWS/Azure/GCP)",
            "AI / ML Platforms", "HR Tech / Recruiting",
            "MarTech / AdTech", "Legal Tech",
            "Supply Chain / Logistics", "Manufacturing",
            "Insurance", "Real Estate / PropTech", "Telecom",
            "Retail / E-commerce Platforms", "Media & Publishing",
            "Government / GovTech", "Consulting / Professional Services",
            "Automotive / Mobility", "Energy / Utilities",
            "Biotech / Pharma", "Construction / AEC",
            "Nonprofit / Impact Orgs", "Hospitality / Travel Tech",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["chatgpt", "claude", "linkedin", "email", "sales"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # FRIDAY — Logo & Graphic Design
    # ═══════════════════════════════════════════════════════════════════
    4: {
        "category": "Logo & Graphic Design",
        "base_task": (
            "3 structured DALL-E 3 / Midjourney prompts for {SUB_NICHE} "
            "for a {INDUSTRY} brand. Each must include STYLE:, SUBJECT:, "
            "COLOR PALETTE:, TYPOGRAPHY RULES:, COMPOSITION:, MOOD:, "
            "BACKGROUND:, NEGATIVE PROMPT:, and OUTPUT SPECS: section "
            "headers. Use [BRAND NAME, e.g., 'TiltedPrompts'], "
            "[BRAND COLOR, e.g., '#6C5CE7'], [TAGLINE, e.g., "
            "'Compress the Distance'], and [ICON CONCEPT] placeholders."
        ),
        "sub_niches": [
            "minimalist wordmark logos with custom geometric letterform styling",
            "abstract symbol logomarks with golden-ratio proportional grids",
            "mascot character logo designs with distinct brand personality",
            "lettermark monogram logos for premium professional brands",
            "emblem and badge-style logos with circular vintage framing",
            "app icon designs optimized for iOS/Android grid specifications",
            "favicon and browser tab icon designs at 16x16 and 32x32",
            "social media avatar and profile picture design sets across platforms",
            "brand color palette generators with WCAG accessibility contrast ratios",
            "typography pairing systems for heading, body, and accent fonts",
            "business card layout designs with front and back print bleeds",
            "letterhead and branded document header and footer designs",
            "repeating brand pattern generators for packaging and textiles",
            "icon set designs for product feature and service illustrations",
            "infographic template layouts with chart and data visualization zones",
            "presentation slide master template designs with speaker note areas",
            "email signature banner graphics with clickable CTA zones",
            "packaging label and product sticker designs for physical goods",
            "merchandise and swag design concepts for events and gifting",
            "animated logo reveal storyboard concepts with frame-by-frame notes",
        ],
        "industries": [
            "Tech Startup / SaaS", "FinTech / Banking", "HealthTech / MedTech",
            "E-commerce / D2C Brand", "Food & Beverage / Restaurant",
            "Fitness & Wellness Studio", "Real Estate Agency",
            "Law Firm / Legal Practice", "Management Consulting Firm",
            "Creative Agency / Design Studio", "Cloud / DevOps Platform",
            "Crypto / Web3 Project", "EdTech / Online Academy",
            "Fashion & Apparel Brand", "Beauty & Skincare Brand",
            "Pet Care Brand", "Sustainable / Eco-Friendly Brand",
            "Music Label / Podcast Network", "NGO / Charitable Foundation",
            "Personal Brand / Creator Economy", "Architecture Firm",
            "Automotive / EV Brand", "Gaming / Esports Studio",
            "Coffee Shop / Specialty Cafe", "Craft Brewery / Artisan Distillery",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["midjourney", "dalle", "design", "branding", "logo"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # SATURDAY — Education & Course Creation
    # ═══════════════════════════════════════════════════════════════════
    5: {
        "category": "Education & Course Creation",
        "base_task": (
            "3 structured ChatGPT/Claude prompts for creating "
            "{SUB_NICHE} in {INDUSTRY}. Each must include ROLE:, "
            "OBJECTIVE:, TARGET LEARNER:, PREREQUISITES:, "
            "LEARNING OUTCOMES:, MODULE STRUCTURE:, CONTENT FORMAT:, "
            "ASSESSMENT STRATEGY:, and DELIVERY NOTES: section headers. "
            "Use [COURSE TITLE, e.g., 'AI for Product Managers'], "
            "[INSTRUCTOR NAME], [PLATFORM, e.g., 'Udemy'], and "
            "[PRICE POINT, e.g., '$199'] placeholders."
        ),
        "sub_niches": [
            "5-module online course outlines with lesson-by-lesson breakdowns",
            "60-minute live workshop scripts with timed activity blocks",
            "quiz and assessment generators aligned to Bloom's taxonomy levels",
            "course sales landing page copy with social proof and urgency sections",
            "student workbook and downloadable exercise template bundles",
            "video lecture scripts with on-screen visual cue and B-roll markers",
            "professional certification program blueprint and rubric designs",
            "half-day workshop facilitation guides with group exercise prompts",
            "learning outcome and competency mapping frameworks per module",
            "multi-course curriculum roadmap planners for online academies",
            "student satisfaction and NPS survey generators with benchmarks",
            "course pricing and tiered packaging strategy frameworks",
            "cohort-based course community engagement and ritual playbooks",
            "micro-learning 5-minute module designers for mobile-first delivery",
            "Harvard-style case study teaching guides with discussion prompts",
            "simulation and role-play scenario builders for soft-skill training",
            "peer review rubric and structured grading criteria generators",
            "course pre-launch and launch-week email marketing sequences",
            "student onboarding and orientation flow wireframes",
            "spaced-repetition knowledge check and flashcard quiz builders",
        ],
        "industries": [
            "AI / Machine Learning", "Data Science & Analytics",
            "Digital Marketing & Growth", "Product Management",
            "UX / UI Design", "Web Development / Full-Stack",
            "Business Strategy & MBA Prep", "Financial Literacy & Investing",
            "Leadership & Management", "Cybersecurity & Ethical Hacking",
            "Cloud Computing (AWS / Azure / GCP)", "Blockchain & Web3 Dev",
            "Content Creation & YouTube Growth", "Sales & Negotiation",
            "Project Management (PMP / Agile / Scrum)", "Public Speaking",
            "Graphic Design & Branding", "Mobile App Development",
            "DevOps & Site Reliability Engineering", "Entrepreneurship & Startups",
            "Photography & Videography", "Music Production & Audio",
            "Language Learning & IELTS Prep", "Health & Nutrition Coaching",
            "Career Development & Job Search Strategy",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["chatgpt", "claude", "education", "course-creation", "elearning"],
    },

    # ═══════════════════════════════════════════════════════════════════
    # SUNDAY — Resume & Job Tools
    # ═══════════════════════════════════════════════════════════════════
    6: {
        "category": "Resume & Job Tools",
        "base_task": (
            "3 structured prompts for generating {SUB_NICHE} targeting "
            "{INDUSTRY} roles. Each must include ROLE:, OBJECTIVE:, "
            "INPUT FORMAT:, TARGET ROLE:, KEY SKILLS:, OUTPUT FORMAT:, "
            "ATS OPTIMIZATION RULES:, TONE:, and EXAMPLE OUTPUT: "
            "section headers. Use [CANDIDATE NAME], "
            "[TARGET COMPANY, e.g., 'Google'], "
            "[JOB DESCRIPTION — paste the full JD here], and "
            "[YEARS OF EXPERIENCE, e.g., '5'] placeholders."
        ),
        "sub_niches": [
            "ATS-optimized resume builders with keyword density scoring against JDs",
            "tailored cover letter generators matching specific job description language",
            "LinkedIn headline and About-section profile optimizers with SEO hooks",
            "portfolio case study presentation frameworks for design and PM roles",
            "behavioral interview prep STAR-method response generators",
            "salary negotiation email scripts with Glassdoor market-data anchoring",
            "career pivot narrative builders for industry and role changers",
            "professional networking cold outreach email templates with warm hooks",
            "job description analyzer and hidden-requirements decoder prompts",
            "skills gap assessment and 90-day upskilling plan generators",
            "personal brand statement and 30-second elevator pitch builders",
            "networking event elevator pitch scripts with memorable closers",
            "professional reference request email templates with context briefings",
            "post-interview thank-you note generators with specific recall hooks",
            "job search pipeline tracker and weekly application review templates",
            "5-year career development roadmap and promotion-path generators",
            "mentorship request and cold LinkedIn outreach message templates",
            "informational interview question frameworks by seniority level",
            "take-home project and work sample presentation format guides",
            "professional conference speaker bio generators with talk abstracts",
        ],
        "industries": [
            "Software Engineer / Full-Stack Developer",
            "Product Manager / Group PM",
            "Data Scientist / ML Engineer",
            "Marketing Manager / Growth Lead",
            "UX / UI Designer / Design Lead",
            "Sales Representative / Account Executive",
            "Project Manager / Scrum Master",
            "Business Analyst / Strategy Consultant",
            "DevOps / SRE / Platform Engineer",
            "Content Writer / Content Strategist",
            "HR Manager / People Operations Lead",
            "Financial Analyst / FP&A Manager",
            "Operations Manager / COO",
            "Customer Success Manager / CSM Lead",
            "Graphic Designer / Creative Director",
            "QA Engineer / SDET / Test Lead",
            "Solutions Architect / Pre-Sales Engineer",
            "Technical Writer / Documentation Lead",
            "CTO / VP Engineering / Engineering Manager",
            "Data Engineer / Analytics Engineer",
            "Cybersecurity Analyst / Security Engineer",
            "Management Consultant / Associate",
            "Supply Chain Manager / Procurement Lead",
            "Healthcare Professional / Clinical Researcher",
            "Teacher / Instructional Designer / L&D Specialist",
        ],
        "count": 3,
        "is_premium": True,
        "platforms": ["chatgpt", "claude", "resume", "career", "linkedin"],
    },
}


# ---------------------------------------------------------------------------
# Framework-Specific Functions
# ---------------------------------------------------------------------------

def generate_framework(
    task: str,
    count: int = 3,
    target_tool: str = "ChatGPT/Claude",
    language: str = "English",
    extra_notes: str = "",
) -> dict:
    """
    Generate structured framework prompts via the Flask bundle generator.
    The FRAMEWORK_DIRECTIVE is auto-prepended to enforce rigid formatting.
    """
    full_notes = (
        f"{FRAMEWORK_DIRECTIVE}\n\n"
        f"TARGET TOOL: {target_tool}\n\n"
        f"{extra_notes}"
    ).strip()

    url = f"{FLASK_API_URL}/generate"
    payload = {
        "niche": task,
        "count": min(max(count, 1), 10),
        "bundle_type": "prompts",
        "language": language,
        "tone": "technical, precise, clinical — like a system specification",
        "extra_notes": full_notes,
    }

    logger.info(f"Framework generation: task='{task[:80]}...', count={count}")

    try:
        resp = requests.post(url, json=payload, timeout=GENERATE_TIMEOUT)
    except requests.ConnectionError:
        raise ConnectionError(
            f"Flask API unreachable at {url}. "
            "Start it with: python bundle_generator.py"
        )
    except requests.Timeout:
        raise TimeoutError(
            f"Flask API timed out after {GENERATE_TIMEOUT}s."
        )

    if resp.status_code == 502:
        raise ValueError("LLM is not responding (502).")
    if resp.status_code == 422:
        raise ValueError(f"LLM parse failed: {resp.json().get('error', '?')}")
    if resp.status_code != 200:
        raise ValueError(f"Flask HTTP {resp.status_code}: {resp.text[:500]}")

    result = resp.json()
    if not result.get("success"):
        raise ValueError(f"Generation failed: {result.get('error', '?')}")

    logger.info(f"Framework generated: '{result.get('product_name')}'")
    return result


def validate_framework(bundle: dict, expected_count: int) -> tuple[bool, list[str]]:
    """
    Validate a generated bundle meets FRAMEWORK quality standards.

    Framework-specific checks:
    - Must have >= 3 CAPITALIZED SECTION HEADERS per prompt
    - No conversational filler (please, could you, I'd like, etc.)
    - At least 1 [BRACKETED] placeholder per prompt
    - Minimum 200 characters per prompt (frameworks are dense)
    - Standard structural checks (title, use_case, packaging, size)
    """
    errors: list[str] = []

    prompts = bundle.get("prompts", [])
    if not prompts:
        errors.append("No prompts found in bundle")
    elif len(prompts) < expected_count * 0.8:
        errors.append(
            f"Too few prompts: got {len(prompts)}, "
            f"expected >= {int(expected_count * 0.8)}"
        )

    header_pattern = re.compile(r"^[A-Z][A-Z\s]{2,}:", re.MULTILINE)
    filler_patterns = [
        r"\bplease\b", r"\bcould you\b", r"\bwould you\b",
        r"\bi'd like\b", r"\bi want you to\b", r"\bcan you\b",
        r"\bhelp me\b", r"\bi need you to\b",
    ]
    filler_regex = re.compile("|".join(filler_patterns), re.IGNORECASE)

    for i, prompt in enumerate(prompts):
        label = f"Framework {i+1}"
        title = prompt.get("title", "").strip()
        text = prompt.get("prompt_text", "").strip()
        use_case = prompt.get("use_case", "").strip()

        if not title:
            errors.append(f"{label}: missing title")
        if not text:
            errors.append(f"{label}: missing prompt_text")
            continue
        if not use_case:
            errors.append(f"{label}: missing use_case")

        headers_found = header_pattern.findall(text)
        if len(headers_found) < 3:
            errors.append(
                f"{label}: FRAMEWORK FAIL — found only {len(headers_found)} "
                f"CAPITALIZED HEADERS (need >= 3). Found: {headers_found[:5]}"
            )

        filler_match = filler_regex.search(text)
        if filler_match:
            errors.append(
                f"{label}: FRAMEWORK FAIL — conversational filler detected: "
                f"'{filler_match.group()}'. Must read like a technical spec."
            )

        if "[" not in text or "]" not in text:
            errors.append(
                f"{label}: FRAMEWORK FAIL — no [BRACKETED] placeholders found."
            )

        if len(text) < 200:
            errors.append(
                f"{label}: FRAMEWORK FAIL — only {len(text)} chars (need >= 200)."
            )

        if "{{" in text or "}}" in text:
            errors.append(
                f"{label}: PLACEHOLDER FAIL — contains curly braces. "
                f"Must use [CAPS IN BRACKETS] format."
            )

    packaging = bundle.get("packaging", {})
    if not packaging.get("product_name", "").strip():
        errors.append("Missing product_name in packaging")
    if not packaging.get("description", "").strip():
        errors.append("Missing description in packaging")

    bundle_size = len(json.dumps(bundle).encode("utf-8"))
    if bundle_size > 500_000:
        errors.append(f"Bundle too large: {bundle_size} bytes (max 500,000)")

    return (len(errors) == 0), errors


# ---------------------------------------------------------------------------
# Task Variation Builder
# ---------------------------------------------------------------------------

def _build_task_variations(schedule: dict, count: int) -> list[str]:
    """
    Build `count` unique task strings by sampling from sub_niches x industries.

    Each task is created by formatting the base_task template with a unique
    (sub_niche, industry) pair. This ensures every asset in a batch is
    distinct while staying within the day's commercial category.

    Args:
        schedule: Today's NICHE_SCHEDULE entry
        count: Number of unique tasks to build

    Returns:
        List of unique task description strings

    Example:
        If base_task = "...{SUB_NICHE} in {INDUSTRY}..."
        and sub_niches = ["SEO blogs", "podcast outlines"]
        and industries = ["SaaS", "FinTech"]
        then 4 unique tasks are possible:
            "...SEO blogs in SaaS..."
            "...SEO blogs in FinTech..."
            "...podcast outlines in SaaS..."
            "...podcast outlines in FinTech..."
    """
    base = schedule["base_task"]
    sub_niches = schedule["sub_niches"]
    industries = schedule["industries"]

    # Generate all possible combinations
    all_combos = list(itertools.product(sub_niches, industries))
    sample_size = min(count, len(all_combos))

    # Random sample without replacement ensures uniqueness
    selected = random.sample(all_combos, sample_size)

    tasks = []
    for sub_niche, industry in selected:
        task = base.format(SUB_NICHE=sub_niche, INDUSTRY=industry)
        tasks.append(task)

    logger.info(
        f"Built {len(tasks)} unique tasks from "
        f"{len(sub_niches)} sub-niches x {len(industries)} industries "
        f"({len(all_combos)} total combinations available)"
    )

    return tasks


# ---------------------------------------------------------------------------
# Orchestrator: Single Pipeline Run
# ---------------------------------------------------------------------------

def run_full_pipeline(
    task: str,
    count: int = 3,
    target_tool: str = "ChatGPT/Claude",
    language: str = "English",
    is_premium: bool = True,
    platforms: list[str] | None = None,
    retry_on_failure: bool = True,
) -> dict:
    """Full pipeline: Generate -> Validate -> Ingest. Returns result dict."""
    start_time = time.time()
    attempt = 0
    max_attempts = 2 if retry_on_failure else 1

    while attempt < max_attempts:
        attempt += 1
        logger.info(f"Pipeline attempt {attempt}/{max_attempts}")

        try:
            gen_result = generate_framework(
                task=task, count=count,
                target_tool=target_tool, language=language,
            )
            bundle = gen_result.get("bundle", {})

            is_valid, errors = validate_framework(bundle, expected_count=count)

            if not is_valid:
                logger.warning(f"Validation failed (attempt {attempt}): {errors}")
                if attempt < max_attempts:
                    continue
                return {
                    "success": False,
                    "error": f"Validation failed after {max_attempts} attempts",
                    "validation_errors": errors,
                    "generation_time_seconds": round(time.time() - start_time, 1),
                }

            db_result = ingest_to_database(
                bundle=bundle,
                metadata={
                    "niche": task,
                    "bundle_type": "prompt_bundle",
                    "is_premium": is_premium,
                    "platforms": platforms,
                },
            )

            elapsed = round(time.time() - start_time, 1)
            return {
                "success": True,
                "asset_id": db_result.get("asset_id", "unknown"),
                "title": db_result.get("title", gen_result.get("product_name", "")),
                "prompt_count": len(bundle.get("prompts", [])),
                "is_premium": is_premium,
                "target_tool": target_tool,
                "platforms": platforms or [],
                "generation_time_seconds": elapsed,
            }

        except (ConnectionError, TimeoutError, PermissionError) as e:
            return {
                "success": False, "error": str(e),
                "error_type": type(e).__name__,
                "generation_time_seconds": round(time.time() - start_time, 1),
            }
        except ValueError as e:
            if attempt < max_attempts:
                logger.warning(f"Retryable error (attempt {attempt}): {e}")
                continue
            return {
                "success": False, "error": str(e),
                "error_type": "ValueError",
                "generation_time_seconds": round(time.time() - start_time, 1),
            }

    return {"success": False, "error": "Exhausted all retry attempts"}


# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  OVERNIGHT BATCH CRON SCHEDULER                                         ║
# ║                                                                         ║
# ║  This is the core loop that runs overnight (10 PM - 5 AM IST).          ║
# ║  It generates CRON_BATCH_SIZE (default 50) unique framework assets      ║
# ║  from today's category, sleeping between each to span the window        ║
# ║  and avoid crashing the local LLM.                                      ║
# ║                                                                         ║
# ║  Sleep is calculated dynamically:                                       ║
# ║    sleep = (window_hours * 3600 - batch * est_gen_time) / (batch - 1)   ║
# ║  With a minimum floor of CRON_MIN_SLEEP (default 60s).                  ║
# ║                                                                         ║
# ║  On crash or KeyboardInterrupt, partial results are saved to LOG_DIR.   ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

def run_cron_schedule(
    batch_size: int | None = None,
    sleep_override: int | None = None,
    dry_run: bool = False,
) -> dict:
    """
    Execute overnight batch: generate unique framework assets for today's
    commercial category, sleeping between iterations to span the window.

    Args:
        batch_size: Override CRON_BATCH_SIZE (default: 50)
        sleep_override: Force a specific sleep duration in seconds
        dry_run: If True, print the task list without generating anything

    Returns:
        dict with batch summary including successes, failures, and results
    """
    today = datetime.now(timezone.utc).weekday()
    schedule = NICHE_SCHEDULE.get(today)

    if not schedule:
        return {"success": False, "error": f"No schedule for weekday {today}"}

    day_name = DAY_NAMES[today]
    category = schedule["category"]
    count = batch_size or CRON_BATCH_SIZE

    # ── Calculate adaptive sleep ──────────────────────────────────
    if sleep_override is not None:
        sleep_seconds = max(CRON_MIN_SLEEP, sleep_override)
    else:
        total_window = int(CRON_WINDOW_HOURS * 3600)
        sleep_seconds = max(
            CRON_MIN_SLEEP,
            (total_window - count * ESTIMATED_GEN_SECONDS) // max(count - 1, 1),
        )

    est_duration_hours = (count * (ESTIMATED_GEN_SECONDS + sleep_seconds)) / 3600

    logger.info("=" * 70)
    logger.info(f"OVERNIGHT BATCH: {day_name} — {category}")
    logger.info(f"  Batch size  : {count} assets")
    logger.info(f"  Sleep       : {sleep_seconds}s between generations")
    logger.info(f"  Est duration: {est_duration_hours:.1f} hours")
    logger.info(f"  Log dir     : {LOG_DIR}")
    logger.info("=" * 70)

    # ── Build unique task variations ──────────────────────────────
    tasks = _build_task_variations(schedule, count)

    # ── Dry run mode ──────────────────────────────────────────────
    if dry_run:
        logger.info("DRY RUN — listing tasks without generating:")
        for i, task in enumerate(tasks):
            logger.info(f"  [{i+1:>3}/{len(tasks)}] {task[:120]}...")
        return {
            "day": day_name,
            "category": category,
            "mode": "dry_run",
            "batch_size": len(tasks),
            "sleep_seconds": sleep_seconds,
            "est_duration_hours": round(est_duration_hours, 1),
            "tasks": [t[:200] for t in tasks],
        }

    # ── Batch execution loop ──────────────────────────────────────
    results: list[dict] = []
    successes = 0
    failures = 0
    duplicates = 0

    batch_start = time.time()

    for i, task in enumerate(tasks):
        iteration = i + 1
        logger.info(f"[{iteration:>3}/{len(tasks)}] Generating: {task[:100]}...")

        try:
            result = run_full_pipeline(
                task=task,
                count=schedule["count"],
                is_premium=schedule["is_premium"],
                platforms=schedule.get("platforms"),
            )

            if result.get("success"):
                successes += 1
                logger.info(
                    f"[{iteration:>3}/{len(tasks)}] OK — "
                    f"'{result.get('title', '?')}' "
                    f"({result.get('generation_time_seconds', '?')}s)"
                )
            else:
                error_msg = result.get("error", "")
                if "uplicate" in error_msg:
                    duplicates += 1
                    logger.warning(
                        f"[{iteration:>3}/{len(tasks)}] DUPLICATE — skipped"
                    )
                else:
                    failures += 1
                    logger.warning(
                        f"[{iteration:>3}/{len(tasks)}] FAIL — {error_msg[:120]}"
                    )

            results.append({
                "index": iteration,
                "task": task[:200],
                "result": result,
            })

        except Exception as e:
            failures += 1
            logger.error(f"[{iteration:>3}/{len(tasks)}] CRASH — {e}")
            results.append({
                "index": iteration,
                "task": task[:200],
                "result": {"success": False, "error": str(e)},
            })

        # Sleep between iterations (not after the last one)
        if iteration < len(tasks):
            elapsed_so_far = time.time() - batch_start
            remaining = len(tasks) - iteration
            logger.info(
                f"  Sleeping {sleep_seconds}s... "
                f"[{successes} ok / {failures} fail / {duplicates} dup] "
                f"({elapsed_so_far/3600:.1f}h elapsed, ~{remaining} left)"
            )
            try:
                time.sleep(sleep_seconds)
            except KeyboardInterrupt:
                logger.warning(
                    "KeyboardInterrupt — saving partial results and exiting"
                )
                break

    # ── Batch summary ─────────────────────────────────────────────
    batch_elapsed = round(time.time() - batch_start, 1)

    summary = {
        "day": day_name,
        "category": category,
        "batch_size": len(tasks),
        "completed": len(results),
        "successes": successes,
        "failures": failures,
        "duplicates": duplicates,
        "elapsed_seconds": batch_elapsed,
        "elapsed_hours": round(batch_elapsed / 3600, 2),
        "sleep_between_seconds": sleep_seconds,
        "results": results,
    }

    logger.info("=" * 70)
    logger.info(
        f"BATCH COMPLETE: {successes} ok / {failures} fail / "
        f"{duplicates} dup out of {len(results)} — "
        f"{batch_elapsed:.0f}s ({batch_elapsed/3600:.1f}h)"
    )
    logger.info("=" * 70)

    # ── Save batch report to disk ─────────────────────────────────
    os.makedirs(LOG_DIR, exist_ok=True)
    report_name = (
        f"framework_batch_{day_name.lower()}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )
    report_path = os.path.join(LOG_DIR, report_name)

    try:
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, default=str)
        logger.info(f"Batch report saved: {report_path}")
    except OSError as e:
        logger.error(f"Could not save batch report: {e}")

    return summary


# ---------------------------------------------------------------------------
# CLI Interface
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="TiltedPrompts Framework Generator — Overnight Batch Engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full overnight cron (50 assets, adaptive sleep)
  python tools.py --cron

  # Quick test batch (5 assets, 30s sleep)
  python tools.py --cron --batch-size 5 --sleep 30

  # Preview what would be generated (no LLM calls)
  python tools.py --cron --dry-run

  # Single manual framework generation
  python tools.py framework --task "Cinematic SaaS thumbnail for Midjourney"
  python tools.py framework --task "AI CFO quarterly report" --tool "Claude"

  # Health check
  python tools.py health

Configuration (env vars):
  FRAMEWORK_BATCH_SIZE    Batch size per cron run (default: 50)
  FRAMEWORK_WINDOW_HOURS  Overnight window in hours (default: 7)
  FRAMEWORK_EST_GEN_SECS  Estimated seconds per generation (default: 180)
  FRAMEWORK_MIN_SLEEP     Minimum sleep between gens (default: 60)
  TILTEDPROMPTS_LOG_DIR   Directory for batch reports
        """,
    )

    # Global cron flags
    parser.add_argument(
        "--cron", action="store_true",
        help="Run overnight batch cron schedule",
    )
    parser.add_argument(
        "--batch-size", type=int, default=None,
        help=f"Override batch size (default: {CRON_BATCH_SIZE})",
    )
    parser.add_argument(
        "--sleep", type=int, default=None,
        help="Override sleep seconds between generations",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Preview batch tasks without generating",
    )

    subparsers = parser.add_subparsers(dest="command")

    # Framework subcommand
    fw_parser = subparsers.add_parser(
        "framework", help="Generate a single framework bundle",
    )
    fw_parser.add_argument(
        "--task", required=True, help="Framework task description",
    )
    fw_parser.add_argument(
        "--count", type=int, default=3, help="Prompts per bundle (default: 3)",
    )
    fw_parser.add_argument(
        "--tool", default="ChatGPT/Claude", help="Target tool",
    )
    fw_parser.add_argument(
        "--premium", action="store_true", default=True,
    )
    fw_parser.add_argument(
        "--platforms", nargs="+", help="Platform tags",
    )

    # Health subcommand
    subparsers.add_parser("health", help="Check Flask API health")

    args = parser.parse_args()

    if args.cron:
        logger.info("=" * 70)
        logger.info("FRAMEWORK CRON: Starting overnight batch generation")
        logger.info("=" * 70)
        result = run_cron_schedule(
            batch_size=args.batch_size,
            sleep_override=args.sleep,
            dry_run=args.dry_run,
        )
        print(json.dumps(result, indent=2, default=str))
        success = result.get("successes", 0) > 0 or result.get("mode") == "dry_run"
        sys.exit(0 if success else 1)

    elif args.command == "health":
        try:
            resp = requests.get(f"{FLASK_API_URL}/health", timeout=10)
            h = resp.json()
            print(f"Flask API: OK (LLM: {h.get('llm_provider', '?')})")
        except Exception as e:
            print(f"Flask API: UNREACHABLE — {e}")
            sys.exit(1)

    elif args.command == "framework":
        logger.info("=" * 70)
        logger.info(f"FRAMEWORK MODE: '{args.task}'")
        logger.info("=" * 70)
        result = run_full_pipeline(
            task=args.task, count=args.count,
            target_tool=args.tool, is_premium=args.premium,
            platforms=args.platforms,
        )
        print(json.dumps(result, indent=2, default=str))
        sys.exit(0 if result.get("success") else 1)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
