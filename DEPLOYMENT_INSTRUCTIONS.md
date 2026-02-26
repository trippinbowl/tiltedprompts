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

## 🌐 Step 3: Link `tiltedprompts.ai`
Once the deployment finishes (takes about 2 mins), Vercel will give you a temporary `.vercel.app` URL. 
Let's link your sleek premium domain:
1. Go to your new project's **Settings** on Vercel.
2. Click **Domains** on the left menu.
3. Type `tiltedprompts.ai` and click **Add**.
4. Vercel will give you specific DNS records (usually an `A` record pointing to `76.76.21.21` or a `CNAME` pointing to `cname.vercel-dns.com`).
5. Go to wherever you bought your domain (GoDaddy, Namecheap, Cloudflare, etc.), open the **DNS Settings**, and add exactly what Vercel tells you to.

Your site will be live worldwide in less than 15 minutes! 🎉
