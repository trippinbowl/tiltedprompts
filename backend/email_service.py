"""
tiltedprompts – Email Service

Gmail SMTP sender with HTML template rendering.
Designed to be swappable to SendGrid/Resend later via config.
"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

import config

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).parent / "templates"


def render_template(template_name: str, variables: dict) -> str:
    """Load an HTML template and replace {variables}."""
    template_path = TEMPLATE_DIR / template_name
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")

    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    for key, value in variables.items():
        html = html.replace(f"{{{key}}}", str(value))

    return html


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
) -> bool:
    """
    Send an email via Gmail SMTP.

    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_body: HTML email content
        text_body: Plain text fallback (auto-generated if None)

    Returns:
        True if sent successfully, False otherwise
    """
    if not config.GMAIL_USER or not config.GMAIL_APP_PASSWORD:
        logger.error("Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env")
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = f"{config.GMAIL_FROM_NAME} <{config.GMAIL_USER}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    # Plain text fallback
    if not text_body:
        text_body = html_body.replace("<br>", "\n").replace("</p>", "\n")
        import re
        text_body = re.sub(r"<[^>]+>", "", text_body)

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(config.GMAIL_USER, config.GMAIL_APP_PASSWORD)
            server.send_message(msg)
        logger.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


def send_product_email(
    buyer_email: str,
    buyer_name: str,
    product_name: str,
    download_link: str,
) -> bool:
    """Send the product delivery email using the product_email.html template."""
    html = render_template("product_email.html", {
        "buyer_name": buyer_name or "there",
        "product_name": product_name,
        "download_link": download_link,
        "brand_name": config.BRAND_NAME,
        "support_email": config.SUPPORT_EMAIL,
        "tagline": config.TAGLINE,
    })

    return send_email(
        to_email=buyer_email,
        subject=f"🎉 Your {product_name} is ready! — {config.BRAND_NAME}",
        html_body=html,
    )


def send_lead_magnet_email(
    email: str,
    name: str,
    download_link: str,
) -> bool:
    """Send the free lead magnet download email."""
    html = render_template("lead_magnet_email.html", {
        "name": name or "there",
        "download_link": download_link,
        "brand_name": config.BRAND_NAME,
        "support_email": config.SUPPORT_EMAIL,
        "tagline": config.TAGLINE,
    })

    return send_email(
        to_email=email,
        subject=f"🎁 Your free AI prompts from {config.BRAND_NAME}!",
        html_body=html,
    )
