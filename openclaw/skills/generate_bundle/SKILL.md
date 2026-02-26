---
name: generate_bundle
description: Generate an AI prompt bundle for a specific niche. Calls the tiltedprompts bundle generator API to create professional prompt packs, GPT instructions, and packaging for SMBs.
requires:
  env:
    - TILTEDPROMPTS_API_URL
  binaries:
    - curl
---

# Generate Bundle Skill

You are the tiltedprompts product generation assistant. When the user asks you to generate, create, or make a prompt bundle, prompt pack, or GPT instructions, use this skill.

## When to Use

- User says: "generate a bundle for [niche]", "create prompts for [topic]", "make a prompt pack about [subject]"
- User wants AI prompt products for any business niche
- User requests GPT custom instructions for a specific use case

## How to Execute

1. **Parse the user request** to extract:
   - `niche` (required): The business niche or topic (e.g., "Instagram marketing for Indian D2C brands")
   - `language` (optional, default: "English"): Output language
   - `tone` (optional, default: "professional yet friendly"): Writing tone
   - `bundle_type` (optional, default: "mixed"): One of "prompts", "gpt_instructions", or "mixed"
   - `count` (optional, default: 10): Number of prompts to generate
   - `extra_notes` (optional): Any additional context or requirements

2. **Call the bundle generator API** using curl or HTTP:

```bash
curl -X POST "${TILTEDPROMPTS_API_URL}/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "niche": "<extracted niche>",
    "language": "<language>",
    "tone": "<tone>",
    "bundle_type": "<bundle_type>",
    "count": <count>,
    "extra_notes": "<extra_notes>"
  }'
```

3. **Process the response.** The API returns:
```json
{
  "success": true,
  "bundle_id": "abc12345",
  "product_name": "Product Name",
  "files": {
    "json": "/path/to/bundle.json",
    "markdown": "/path/to/bundle.md"
  },
  "preview": {
    "description": "...",
    "prompt_count": 10,
    "tags": ["tag1", "tag2"]
  }
}
```

4. **Report back to the user** with:
   - ✅ Product name
   - 📁 File locations (JSON and Markdown)
   - 📝 Short preview/description
   - 🏷️ Tags
   - 💰 Suggested pricing from the bundle

## Error Handling

- If the API is unreachable, tell the user: "Bundle generator is not running. Please start it with: `python bundle_generator.py` in the backend directory."
- If the LLM fails (502 error), tell the user: "The LLM is not responding. Check that your local LLM is running, or switch to DeepSeek by setting LLM_PROVIDER=deepseek in .env."

## Example Interaction

**User:** "Generate a prompt bundle for WhatsApp marketing for Indian retail stores"

**You:** Call the API with niche="WhatsApp marketing for Indian retail stores", bundle_type="mixed", count=10

**Response to user:**
> ✅ **Bundle Created: "WhatsApp Marketing Mastery for Indian Retail"**
> 📁 Files saved to `bundles/whatsapp-marketing-mastery_a1b2c3d4/`
> 📝 10 copy-paste ready prompts + custom GPT instructions for retail WhatsApp campaigns
> 🏷️ Tags: whatsapp, retail, india, marketing, sms
> 💰 Suggested: Free tier (3 prompts) | Starter ₹499 | Pro ₹1,499
