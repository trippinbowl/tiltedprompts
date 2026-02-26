-- Insert 5 Seed Assets into the library_assets table
INSERT INTO public.library_assets (title, description, asset_type, platform, content, is_premium)
VALUES 
(
    'WhatsApp Cart Recovery Sequence',
    '15 meticulously tested message templates for Shopify/WooCommerce abandoned cart recovery via WhatsApp Business API.',
    'prompt_bundle',
    ARRAY['whatsapp', 'ecommerce'],
    '{"templates": [{"name": "1 Hour Reminder", "body": "Hey {{name}}, looks like you left something behind!"}]}',
    false
),
(
    'SEO Blog Generator Prompt',
    'A massive 1500-token meta-prompt designed to write highly ranking, localized SEO articles for the Indian tech market.',
    'prompt_bundle',
    ARRAY['seo', 'content'],
    '{"prompt": "You are an expert Indian SEO copywriter..."}',
    false
),
(
    'Instagram to WhatsApp Pipeline',
    'Importable n8n workflow. Captures Instagram DM intent, scores leads via AI, and triggers automated WhatsApp outreach.',
    'n8n_workflow',
    ARRAY['instagram', 'whatsapp', 'n8n'],
    '{"nodes": [{"name": "Webhook", "type": "n8n-nodes-base.webhook"}]}',
    true
),
(
    'Shopify Support Agent Skills',
    'OpenClaw compatible skills (.md files) that grant your AI agent the ability to securely query order status and process refunds.',
    'openclaw_skill',
    ARRAY['shopify', 'customer_support'],
    '{"skills": ["check_order_status", "initiate_refund"]}',
    true
),
(
    'Razorpay Dispute Automation',
    'n8n template that monitors Razorpay webhooks for chargebacks and automatically compiles defense evidence from your DB.',
    'n8n_workflow',
    ARRAY['razorpay', 'finance'],
    '{"nodes": [{"name": "Razorpay Trigger", "type": "n8n-nodes-base.razorpay"}]}',
    true
);
