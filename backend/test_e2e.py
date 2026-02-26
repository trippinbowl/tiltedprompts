"""
tiltedprompts – End-to-End Test

Tests the bundle generator pipeline by simulating an LLM response
using the sample_response.json file. Validates: saving, listing, previewing.

Usage: python test_e2e.py  (server must be running on localhost:5000)
"""
import json
import sys
import shutil
from pathlib import Path

import requests

BASE_URL = "http://localhost:5000"

def test_health():
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["brand"] == "tiltedprompts"
    print("✅ Health check passed")
    return True

def test_save_sample_bundle():
    """Simulate a successful generation by directly saving the sample response."""
    import config
    sample = Path(__file__).parent / "sample_response.json"
    with open(sample, "r", encoding="utf-8") as f:
        bundle = json.load(f)

    # Save it to bundles dir as if it was generated
    bundle_dir = config.BUNDLES_DIR / "test-indian-smb-marketing_testid01"
    bundle_dir.mkdir(parents=True, exist_ok=True)

    with open(bundle_dir / "bundle.json", "w", encoding="utf-8") as f:
        json.dump(bundle, f, indent=2, ensure_ascii=False)

    with open(bundle_dir / "params.json", "w", encoding="utf-8") as f:
        json.dump({"niche": "Indian SMB marketing", "bundle_type": "mixed", "count": 10}, f, indent=2)

    print("✅ Sample bundle saved to disk")
    return bundle_dir.name

def test_list_bundles():
    r = requests.get(f"{BASE_URL}/bundles")
    assert r.status_code == 200
    data = r.json()
    assert data["total"] > 0
    assert len(data["bundles"]) > 0
    bundle = data["bundles"][0]
    assert "product_name" in bundle
    assert "prompt_count" in bundle
    print(f"✅ List bundles: found {data['total']} bundle(s)")
    print(f"   First bundle: {bundle['product_name']} ({bundle['prompt_count']} prompts)")
    return data["bundles"][0]["folder"]

def test_get_bundle(folder):
    r = requests.get(f"{BASE_URL}/bundles/{folder}")
    assert r.status_code == 200
    data = r.json()
    assert "bundle" in data
    prompts = data["bundle"].get("prompts", [])
    assert len(prompts) > 0
    print(f"✅ Get bundle: retrieved {len(prompts)} prompts")

def test_preview_bundle(folder):
    r = requests.get(f"{BASE_URL}/bundles/{folder}/preview")
    assert r.status_code == 200
    data = r.json()
    assert "product_name" in data
    assert "sample_prompts" in data
    assert len(data["sample_prompts"]) <= 3
    print(f"✅ Preview bundle: '{data['product_name']}'")
    for i, p in enumerate(data["sample_prompts"], 1):
        print(f"   Sample {i}: {p['title']}")

def test_bundles_404():
    r = requests.get(f"{BASE_URL}/bundles/nonexistent-bundle")
    assert r.status_code == 404
    print("✅ 404 for nonexistent bundle: correct")

def cleanup(folder_name):
    """Remove test bundle."""
    import config
    test_dir = config.BUNDLES_DIR / folder_name
    if test_dir.exists():
        shutil.rmtree(test_dir)
        print(f"🧹 Cleaned up test bundle: {folder_name}")


if __name__ == "__main__":
    print(f"\n{'='*50}")
    print(f"  tiltedprompts Bundle Generator – E2E Test")
    print(f"{'='*50}\n")

    try:
        test_health()
        folder = test_save_sample_bundle()
        listed_folder = test_list_bundles()
        test_get_bundle(listed_folder)
        test_preview_bundle(listed_folder)
        test_bundles_404()
        cleanup(folder)

        print(f"\n{'='*50}")
        print("  ✅ ALL TESTS PASSED")
        print(f"{'='*50}\n")

    except requests.ConnectionError:
        print("❌ Cannot connect to server. Is bundle_generator.py running?")
        sys.exit(1)
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)
