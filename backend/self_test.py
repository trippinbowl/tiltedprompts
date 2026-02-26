"""
tiltedprompts – Self Test

Run this to verify that:
  1. The Flask server is reachable
  2. Your local LLM is responding
  3. The bundle generator can produce valid JSON
  4. Bundle files are saved correctly
  5. Email delivery is configured (optional)

Usage:
  python self_test.py               # full test (needs LLM running)
  python self_test.py --skip-llm    # skip LLM call, test everything else
"""
import argparse
import json
import sys
import time

import requests

BASE_URL = "http://localhost:5000"


def header(title: str):
    print(f"\n{'─'*50}")
    print(f"  {title}")
    print(f"{'─'*50}")


def test_health() -> bool:
    """Test 1: Server health check."""
    print("\n🔍 Test 1: Server health check...")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        data = r.json()
        if data.get("status") == "ok":
            print(f"   ✅ Server is running")
            print(f"   📛 Brand: {data.get('brand')}")
            print(f"   🤖 LLM Provider: {data.get('llm_provider')}")
            return True
        else:
            print(f"   ❌ Unexpected response: {data}")
            return False
    except requests.ConnectionError:
        print(f"   ❌ Cannot connect to {BASE_URL}")
        print(f"   💡 Start the server: python bundle_generator.py")
        return False


def test_generate_bundle() -> dict | None:
    """Test 2: Generate a small bundle via the LLM."""
    print("\n🔍 Test 2: Generate a 3-prompt bundle (this may take 30-90 seconds)...")
    try:
        start = time.time()
        r = requests.post(
            f"{BASE_URL}/generate",
            json={
                "niche": "WhatsApp marketing for Indian retail shops",
                "bundle_type": "prompts",
                "count": 3,
                "language": "English",
                "tone": "professional yet friendly",
                "extra_notes": "Keep prompts short and practical for first-time AI users",
            },
            timeout=180,
        )
        elapsed = time.time() - start

        if r.status_code == 200:
            data = r.json()
            if data.get("success"):
                print(f"   ✅ Bundle generated in {elapsed:.1f}s")
                print(f"   📦 Product: {data.get('product_name')}")
                print(f"   📝 Prompts: {data['preview']['prompt_count']}")
                print(f"   📁 JSON: {data['files']['json']}")
                print(f"   📁 Markdown: {data['files']['markdown']}")
                print(f"   🏷️ Tags: {', '.join(data['preview'].get('tags', []))}")
                return data
            else:
                print(f"   ❌ Generation succeeded but response missing 'success' flag")
                print(f"   Response: {json.dumps(data, indent=2)[:500]}")
                return None
        elif r.status_code == 502:
            data = r.json()
            print(f"   ❌ LLM call failed (502)")
            print(f"   Error: {data.get('error', 'Unknown')}")
            print(f"   💡 Is LM Studio running on port 1234?")
            return None
        elif r.status_code == 422:
            data = r.json()
            print(f"   ❌ LLM responded but JSON parsing failed (422)")
            print(f"   Error: {data.get('error', 'Unknown')}")
            raw = data.get("raw_response", "")
            if raw:
                print(f"   Raw response preview (first 300 chars):")
                print(f"   {raw[:300]}")
            return None
        else:
            print(f"   ❌ Unexpected status: {r.status_code}")
            print(f"   Response: {r.text[:500]}")
            return None

    except requests.Timeout:
        print(f"   ❌ Request timed out (180s). LLM might be too slow.")
        print(f"   💡 Try a smaller model or reduce count to 2.")
        return None
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return None


def test_list_bundles() -> bool:
    """Test 3: List bundles."""
    print("\n🔍 Test 3: List bundles...")
    try:
        r = requests.get(f"{BASE_URL}/bundles", timeout=5)
        data = r.json()
        count = data.get("total", 0)
        print(f"   ✅ Found {count} bundle(s)")
        for b in data.get("bundles", [])[:3]:
            print(f"      • {b.get('product_name')} ({b.get('prompt_count')} prompts)")
        return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_report() -> bool:
    """Test 4: Report endpoint."""
    print("\n🔍 Test 4: Sales report...")
    try:
        r = requests.get(f"{BASE_URL}/report", timeout=5)
        data = r.json()
        summary = data.get("summary", {})
        print(f"   ✅ Report generated")
        print(f"   💰 Total sales: {summary.get('total_sales', 0)}")
        print(f"   💵 Total revenue: ${summary.get('total_revenue', 0):.2f}")
        return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_lead_capture() -> bool:
    """Test 5: Lead capture (sends test email if Gmail is configured)."""
    print("\n🔍 Test 5: Lead capture + email delivery...")
    try:
        r = requests.post(
            f"{BASE_URL}/lead-capture",
            json={"email": "test@example.com", "name": "Self Test", "niche": "testing"},
            timeout=10,
        )
        data = r.json()
        if data.get("success"):
            email_status = "✅ sent" if data.get("email_sent") else "⚠️ not sent (Gmail not configured)"
            print(f"   ✅ Lead captured")
            print(f"   📧 Email: {email_status}")
            if not data.get("email_sent"):
                print(f"   💡 Set GMAIL_USER + GMAIL_APP_PASSWORD in .env to enable emails")
            return True
        else:
            print(f"   ❌ Failed: {data}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_email_to_self() -> bool:
    """Test 6: Send a test email to yourself."""
    print("\n🔍 Test 6: Test email delivery to yourself...")
    import config
    if not config.GMAIL_USER:
        print(f"   ⚠️ Skipped (GMAIL_USER not set)")
        return True

    try:
        r = requests.post(
            f"{BASE_URL}/lead-capture",
            json={"email": config.GMAIL_USER, "name": "Self Test", "niche": "testing"},
            timeout=15,
        )
        data = r.json()
        if data.get("email_sent"):
            print(f"   ✅ Email sent to {config.GMAIL_USER}")
            print(f"   📬 Check your inbox for the free prompts email!")
        else:
            print(f"   ❌ Email sending failed. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env")
        return data.get("email_sent", False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="tiltedprompts Self Test")
    parser.add_argument("--skip-llm", action="store_true", help="Skip LLM generation test")
    parser.add_argument("--send-email", action="store_true", help="Send a test email to yourself")
    args = parser.parse_args()

    header("tiltedprompts Self Test")
    results = {}

    # Test 1: Health
    results["health"] = test_health()
    if not results["health"]:
        print("\n❌ Server not running. Start it first: python bundle_generator.py")
        sys.exit(1)

    # Test 2: Generate (optional)
    if args.skip_llm:
        print("\n⏭️ Skipping LLM generation test (--skip-llm)")
        results["generate"] = None
    else:
        gen_result = test_generate_bundle()
        results["generate"] = gen_result is not None

    # Test 3: List bundles
    results["list"] = test_list_bundles()

    # Test 4: Report
    results["report"] = test_report()

    # Test 5: Lead capture
    results["lead_capture"] = test_lead_capture()

    # Test 6: Email (optional)
    if args.send_email:
        results["email"] = test_email_to_self()

    # Summary
    header("Results")
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)

    for name, status in results.items():
        icon = "✅" if status is True else ("❌" if status is False else "⏭️")
        print(f"   {icon} {name}")

    print(f"\n   {passed} passed, {failed} failed, {skipped} skipped")

    if failed == 0:
        print(f"\n🎉 All tests passed! Your tiltedprompts backend is ready.")
    else:
        print(f"\n⚠️ Some tests failed. Check the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
