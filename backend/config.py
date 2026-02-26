"""
tiltedprompts – Central Configuration
Loads all settings from .env, provides typed defaults.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv(Path(__file__).parent / ".env")


# --- Brand ---
BRAND_NAME = os.getenv("BRAND_NAME", "tiltedprompts")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "hello@tiltedprompts.com")
TAGLINE = os.getenv("TAGLINE", "AI prompts that actually work for your business")

# --- LLM Provider ---
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "local")  # "local" | "deepseek"

# Local LLM – supports both LOCAL_LLM_URL and LOCAL_LLM_BASE_URL
LOCAL_LLM_URL = os.getenv(
    "LOCAL_LLM_URL",
    os.getenv("LOCAL_LLM_BASE_URL", "http://localhost:1234/v1/chat/completions"),
)
LOCAL_LLM_MODEL = os.getenv("LOCAL_LLM_MODEL", "default")

# DeepSeek
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")

# --- Server ---
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# --- Storage ---
BUNDLES_DIR = Path(os.getenv("BUNDLES_DIR", "./bundles")).resolve()
BUNDLES_DIR.mkdir(parents=True, exist_ok=True)

# --- Gmail (Phase 3) ---
GMAIL_USER = os.getenv("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
GMAIL_FROM_NAME = os.getenv("GMAIL_FROM_NAME", BRAND_NAME)

# --- Gumroad (Phase 3) ---
GUMROAD_SELLER_ID = os.getenv("GUMROAD_SELLER_ID", "")
GUMROAD_API_KEY = os.getenv("GUMROAD_API_KEY", "")
