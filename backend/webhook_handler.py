"""
tiltedprompts – Webhook Handler & Report Generator

Endpoints:
  POST /gumroad-webhook     — Gumroad purchase webhook → locate/generate bundle → email buyer
  POST /verify-license      — Chrome extension license verification via Gumroad
  GET  /report              — Sales analytics report
  POST /lead-capture        — Lead magnet form submission → email free prompts
"""
import csv
import json
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from flask import request, jsonify

import config
from email_service import send_product_email, send_lead_magnet_email

logger = logging.getLogger(__name__)

# ---- Sales Log ----
SALES_LOG = config.BUNDLES_DIR / "_sales_log.csv"

def _init_sales_log():
    """Create CSV header if file doesn't exist."""
    if not SALES_LOG.exists():
        with open(SALES_LOG, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "buyer_email", "product_name", "price", "currency", "gumroad_sale_id", "status"])

def log_sale(buyer_email: str, product_name: str, price: float, currency: str = "USD", sale_id: str = "", status: str = "delivered"):
    """Append a sale to the CSV log."""
    _init_sales_log()
    with open(SALES_LOG, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now(timezone.utc).isoformat(),
            buyer_email,
            product_name,
            price,
            currency,
            sale_id,
            status,
        ])

# ---- Leads Log ----
LEADS_LOG = config.BUNDLES_DIR / "_leads_log.csv"

def _init_leads_log():
    if not LEADS_LOG.exists():
        with open(LEADS_LOG, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "email", "name", "niche", "source"])

def log_lead(email: str, name: str = "", niche: str = "", source: str = "form"):
    _init_leads_log()
    with open(LEADS_LOG, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now(timezone.utc).isoformat(), email, name, niche, source])


def register_webhook_routes(app):
    """Register all webhook and report routes on the Flask app."""

    # ==============================
    #  GUMROAD WEBHOOK
    # ==============================
    @app.route("/gumroad-webhook", methods=["POST"])
    def gumroad_webhook():
        """
        Handle Gumroad purchase webhook.

        Gumroad sends form-encoded data with fields like:
        - seller_id, product_id, product_name, price, currency
        - email (buyer), full_name
        - url_params, variants, offer_code, sale_id, etc.

        See: https://gumroad.com/ping
        """
        data = request.form.to_dict() if request.content_type and "form" in request.content_type else request.get_json(force=True, silent=True) or {}

        buyer_email = data.get("email", "")
        buyer_name = data.get("full_name", data.get("name", ""))
        product_name = data.get("product_name", data.get("product", "Unknown Product"))
        price = data.get("price", data.get("formatted_price", "0"))
        currency = data.get("currency", "usd")
        sale_id = data.get("sale_id", "")
        product_id = data.get("product_id", data.get("product_permalink", ""))

        # Parse price to float
        try:
            price_float = float(str(price).replace("$", "").replace("₹", "").replace(",", ""))
        except (ValueError, TypeError):
            price_float = 0.0

        logger.info(f"Gumroad webhook: {buyer_email} bought '{product_name}' for {price} {currency}")

        if not buyer_email:
            return jsonify({"error": "No buyer email in webhook data"}), 400

        # Find matching bundle by product name
        download_link = ""
        bundle_found = False
        for d in config.BUNDLES_DIR.iterdir():
            if d.is_dir() and (d / "bundle.json").exists():
                try:
                    with open(d / "bundle.json", "r", encoding="utf-8") as f:
                        bundle = json.load(f)
                    pkg_name = bundle.get("packaging", {}).get("product_name", "")
                    if pkg_name.lower() in product_name.lower() or product_name.lower() in pkg_name.lower():
                        # In production, this would be a Gumroad/Drive download link
                        download_link = data.get("url_params", {}).get("download_url", f"https://tiltedprompts.gumroad.com/l/{product_id}")
                        bundle_found = True
                        break
                except Exception:
                    continue

        if not download_link:
            download_link = f"https://tiltedprompts.gumroad.com/l/{product_id}"

        # Send delivery email
        email_sent = send_product_email(
            buyer_email=buyer_email,
            buyer_name=buyer_name,
            product_name=product_name,
            download_link=download_link,
        )

        # Log the sale
        status = "delivered" if email_sent else "email_failed"
        log_sale(buyer_email, product_name, price_float, currency, sale_id, status)

        logger.info(f"Sale logged: {product_name} → {buyer_email} (status={status})")

        return jsonify({
            "success": True,
            "buyer_email": buyer_email,
            "product_name": product_name,
            "email_sent": email_sent,
            "status": status,
        })


    # ==============================
    #  LICENSE VERIFICATION (Chrome Ext)
    # ==============================
    @app.route("/verify-license", methods=["POST"])
    def verify_license():
        """
        Verify a Gumroad license key for Chrome extension pro unlock.

        Input: { "license_key": "...", "product_id": "..." }
        """
        data = request.get_json(force=True, silent=True) or {}
        license_key = data.get("license_key", "")
        product_id = data.get("product_id", "")

        if not license_key:
            return jsonify({"valid": False, "error": "No license key provided"}), 400

        # Verify with Gumroad API
        try:
            resp = requests.post(
                "https://api.gumroad.com/v2/licenses/verify",
                data={
                    "product_id": product_id,
                    "license_key": license_key,
                },
                timeout=10,
            )
            result = resp.json()

            if result.get("success"):
                return jsonify({
                    "valid": True,
                    "uses": result.get("uses", 0),
                    "purchase": {
                        "email": result.get("purchase", {}).get("email", ""),
                        "created_at": result.get("purchase", {}).get("created_at", ""),
                    },
                })
            else:
                return jsonify({"valid": False, "error": result.get("message", "Invalid license")}), 403

        except Exception as e:
            logger.error(f"License verification failed: {e}")
            return jsonify({"valid": False, "error": "Verification service unavailable"}), 502


    # ==============================
    #  LEAD CAPTURE
    # ==============================
    @app.route("/lead-capture", methods=["POST"])
    def lead_capture():
        """
        Capture a lead from form submission.
        Sends free lead magnet and logs to CSV.

        Input: { "email": "...", "name": "...", "niche": "..." }
        """
        data = request.get_json(force=True, silent=True) or {}
        email = data.get("email", "")
        name = data.get("name", "")
        niche = data.get("niche", "")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Log the lead
        log_lead(email, name, niche, "api")

        # Send lead magnet email
        # TODO: Replace with actual hosted lead magnet URL
        download_link = "https://tiltedprompts.gumroad.com/l/free-prompts"
        email_sent = send_lead_magnet_email(email, name, download_link)

        logger.info(f"Lead captured: {email} (niche={niche}, email_sent={email_sent})")

        return jsonify({
            "success": True,
            "email": email,
            "email_sent": email_sent,
        })


    # ==============================
    #  REPORT GENERATOR
    # ==============================
    @app.route("/report", methods=["GET"])
    def report():
        """
        Generate a sales analytics report.

        Returns: summary stats, top products, recent sales.
        """
        _init_sales_log()

        sales = []
        try:
            with open(SALES_LOG, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    try:
                        row["price"] = float(row.get("price", 0))
                    except (ValueError, TypeError):
                        row["price"] = 0.0
                    sales.append(row)
        except Exception as e:
            logger.error(f"Error reading sales log: {e}")

        now = datetime.now(timezone.utc)
        seven_days_ago = now - timedelta(days=7)

        # Summary
        total_sales = len(sales)
        total_revenue = sum(s["price"] for s in sales)

        recent_sales = []
        for s in sales:
            try:
                sale_time = datetime.fromisoformat(s["timestamp"])
                if sale_time > seven_days_ago:
                    recent_sales.append(s)
            except (ValueError, KeyError):
                continue

        last_7_sales = len(recent_sales)
        last_7_revenue = sum(s["price"] for s in recent_sales)

        # Top products
        product_stats = {}
        for s in sales:
            name = s.get("product_name", "Unknown")
            if name not in product_stats:
                product_stats[name] = {"sales": 0, "revenue": 0.0}
            product_stats[name]["sales"] += 1
            product_stats[name]["revenue"] += s["price"]

        top_products = sorted(
            [{"name": k, **v} for k, v in product_stats.items()],
            key=lambda x: x["sales"],
            reverse=True,
        )[:5]

        # Recent 10 sales
        recent_entries = sorted(sales, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]

        return jsonify({
            "summary": {
                "total_sales": total_sales,
                "total_revenue": round(total_revenue, 2),
                "currency": "USD",
                "last_7_days_sales": last_7_sales,
                "last_7_days_revenue": round(last_7_revenue, 2),
            },
            "top_products": top_products,
            "recent_sales": [
                {
                    "date": s.get("timestamp", "")[:10],
                    "product": s.get("product_name", ""),
                    "price": s["price"],
                    "buyer": s.get("buyer_email", "")[:3] + "***",
                }
                for s in recent_entries
            ],
            "report_generated_at": now.isoformat(),
        })

    return app
