# 🚀 Deploying Tilted Prompts to Vercel

Your codebase has been successfully pushed to `https://github.com/trippinbowl/tiltedprompts.git`. It is now ready to be deployed to production!

Follow these exact steps to host your website and link your custom domain.

---

## 🏗️ Step 1: Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** ➡️ **"Project"**.
3. Under the **"Import Git Repository"** section, find `trippinbowl/tiltedprompts` and click **"Import"**.
4. **CRITICAL:** Because this is a monorepo containing multiple Folders, you need to tell Vercel where the website is:
   - Expand the **"Root Directory"** dropdown.
   - Click **"Edit"** and select `website`.
5. The Framework Preset will automatically detect **"Next.js"**.

## 🔑 Step 2: Environment Variables
Before clicking "Deploy", expand the **Environment Variables** section and paste the exact keys from your local `website/.env.local`. 

You *MUST* include these to ensure Auth and Payments work in production:

```env
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Checkout
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_razorpay_key
RAZORPAY_KEY_ID=your_private_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_custom_webhook_secret_string
```
*(Need Razorpay keys? Grab them from the [Razorpay Dashboard -> API Keys](https://dashboard.razorpay.com/app/keys))*

**Once the environment variables are pasted, click "Deploy"!**

---

## 🌐 Step 3: Link `tiltedprompts.ai` via Hostinger
Once the deployment finishes (takes about 2 mins), Vercel will give you a temporary `.vercel.app` URL. Let's link your sleek premium domain `tiltedprompts.ai`:

1. Go to your new project on Vercel and click **Settings** (top menu).
2. Click **Domains** on the left menu.
3. Type `tiltedprompts.ai` and click **Add**.
   *(Vercel will recommend adding both `tiltedprompts.ai` and `www.tiltedprompts.ai`. Choose the recommended option so it redirects properly.)*
4. Vercel will show an "Invalid Configuration" error message. **This is normal!** It will give you two DNS records to add.
5. **Open a new tab** and log in to your **Hostinger Account**.
6. Click on **Domains**, and select `tiltedprompts.ai`.
7. Click on **DNS / Nameservers** on the left-hand sidebar.
8. Scroll down to **Manage DNS records**. You need to add exactly what Vercel gave you:

   **Record 1 (The A Record - for `tiltedprompts.ai`):**
   - Type: `A`
   - Name: `@`
   - Points to: `76.76.21.21` (Verify this IP on Vercel's screen)
   - TTL: Default (or 14400)
   - *Click Add Record.*

   **Record 2 (The CNAME Record - for `www.tiltedprompts.ai`):**
   - Type: `CNAME`
   - Name: `www`
   - Points to: `cname.vercel-dns.com`
   - TTL: Default (or 14400)
   - *Click Add Record.*

   *(Note: If Hostinger already has an `A` record for `@` or a `CNAME` for `www` pointing to something else, like a parked page, **Delete** or **Edit** the existing ones instead of making duplicates!)*

9. Go back to your Vercel tab. Within a few minutes, the red "Invalid Configuration" text will spin and turn into a green checkmark indicating a **Valid Configuration**.

Your site will be live worldwide! 🎉
