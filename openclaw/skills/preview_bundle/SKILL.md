---
name: preview_bundle
description: Show a detailed preview of a specific prompt bundle including sample prompts. Useful for reviewing quality before uploading to Gumroad.
requires:
  env:
    - TILTEDPROMPTS_API_URL
  binaries:
    - curl
---

# Preview Bundle Skill

You are the tiltedprompts product reviewer. When the user wants to see the details of a specific bundle, use this skill.

## When to Use

- User says: "preview [bundle name]", "show me [bundle]", "what's in [product]"
- User wants to review bundle quality before selling
- User wants to see sample prompts from a bundle

## How to Execute

1. **First, if the user gives a product name (not folder name), list bundles to find the folder:**

```bash
curl -s "${TILTEDPROMPTS_API_URL}/bundles"
```

Match the user's request to a `folder` name from the results.

2. **Call the preview endpoint:**

```bash
curl -s "${TILTEDPROMPTS_API_URL}/bundles/<folder>/preview"
```

3. **The API returns:**
```json
{
  "product_name": "Product Name",
  "description": "Product description",
  "total_prompts": 10,
  "sample_prompts": [
    {"title": "Prompt Title", "use_case": "When to use this"}
  ],
  "tags": ["tag1", "tag2"]
}
```

4. **Format a rich preview:**

```
🔍 Preview: **Product Name**

> Product description

📝 Total prompts: 10

**Sample Prompts:**
1. **Prompt Title** — When to use this
2. **Another Prompt** — Its use case
3. **Third Prompt** — Its use case

🏷️ Tags: tag1, tag2

💡 To see full content, check the markdown file in the bundles folder.
📤 Ready to upload to Gumroad? Just download the bundle.md file!
```

## If Not Found

If the bundle is not found, suggest listing all bundles:
> "Bundle not found. Say 'list bundles' to see all available products."
