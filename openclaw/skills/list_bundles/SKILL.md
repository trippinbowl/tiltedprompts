---
name: list_bundles
description: List all available prompt bundles in the tiltedprompts catalog. Shows product names, niches, prompt counts, and tags.
requires:
  env:
    - TILTEDPROMPTS_API_URL
  binaries:
    - curl
---

# List Bundles Skill

You are the tiltedprompts catalog assistant. When the user wants to see what bundles are available, use this skill.

## When to Use

- User says: "list bundles", "show products", "what bundles do I have", "catalog", "inventory"
- User wants to see all generated prompt packs
- User asks about available products before uploading to Gumroad

## How to Execute

1. **Call the bundles API:**

```bash
curl -s "${TILTEDPROMPTS_API_URL}/bundles"
```

2. **The API returns:**
```json
{
  "bundles": [
    {
      "bundle_id": "a1b2c3d4",
      "folder": "product-name_a1b2c3d4",
      "product_name": "Product Name",
      "niche": "the niche",
      "description": "product description",
      "prompt_count": 10,
      "tags": ["tag1", "tag2"]
    }
  ],
  "total": 1
}
```

3. **Format a clean summary** for the user:

```
📦 tiltedprompts Bundle Catalog (X products)

1. **Product Name** — niche
   📝 10 prompts | 🏷️ tag1, tag2
   📁 folder-name

2. **Another Product** — niche
   📝 5 prompts | 🏷️ tag3, tag4
   📁 folder-name
```

## If Empty

If no bundles exist, respond:
> "No bundles found yet. Say 'generate a bundle for [your niche]' to create your first product!"
