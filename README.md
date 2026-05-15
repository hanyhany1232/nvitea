# CoverCraft AI

> AI-generated cover letters that actually fit the job. Powered by DeepSeek.

A Next.js 16 (App Router) SaaS starter that generates tailored, ATS-friendly
cover letters from a job description and a résumé.

**Live demo:** https://out-yvccgafr.devinapps.com/ (UI only — the generator is
disabled. Deploy your own copy below to enable it.)

The generator backend is an **OpenAI-compatible** chat-completions call, so it
runs against:

- **DeepSeek** (default, ~10× cheaper than OpenAI) — `https://api.deepseek.com/v1`, model `deepseek-chat`
- **OpenAI** — set `LLM_BASE_URL=https://api.openai.com/v1` and `COVERCRAFT_MODEL=gpt-4o-mini`
- **OpenRouter, Groq, Together, Mistral**, or any other OpenAI-compatible
  endpoint — set `LLM_BASE_URL` and `COVERCRAFT_MODEL` accordingly.

---

## Quick deploy (live + monetizable in ~10 minutes)

### 1. Get a DeepSeek API key (~2 min)

1. Go to https://platform.deepseek.com/api_keys
2. Sign up / log in (Google or email).
3. Add ~$2 of credits in **Top Up** (DeepSeek V3.2 costs roughly
   $0.00007 per cover letter — $2 = ~28,000 letters).
4. Create a new API key and copy it. Keep it secret.

### 2. Push this code to your GitHub (~2 min)

```bash
# from this directory:
git init -b main
git add .
git commit -m "Initial CoverCraft AI"

# Create an empty repo at https://github.com/new (no README)
git remote add origin https://github.com/<your-username>/covercraft-ai.git
git push -u origin main
```

### 3. Deploy to Vercel (~3 min)

1. Go to https://vercel.com/new and sign in with GitHub.
2. Import the `covercraft-ai` repo.
3. Framework: **Next.js** (auto-detected).
4. **Environment Variables** → add:
   - `DEEPSEEK_API_KEY` = (the key from step 1)
   - *(optional)* `COVERCRAFT_MODEL` = `deepseek-chat`
   - *(optional)* `LLM_BASE_URL` = `https://api.deepseek.com/v1`
5. Click **Deploy**. You'll get a live URL like
   `covercraft-ai.vercel.app` in ~90 seconds.

### 4. Add a custom domain (optional, ~3 min)

1. Buy a domain (`.com` ≈ $12/year on Namecheap or Porkbun).
2. In Vercel → Project → **Settings → Domains** → add your domain.
3. Update DNS as Vercel instructs.

You now have a working CoverCraft AI under your own brand.

---

## Monetization: enable Stripe payments

The site ships with three pricing tiers (Free, $9/mo Pro, $49 lifetime) but
the buttons are placeholders. To turn them on:

1. Create a Stripe account at https://stripe.com (free; takes ~5 min and your
   business / ID info — Morocco supported via Stripe Atlas, or use a Wise
   business account).
2. In Stripe → **Products**, create:
   - **CoverCraft Pro** — recurring, $9/month
   - **CoverCraft Lifetime** — one-time, $49
   Copy each *Price ID* (looks like `price_...`).
3. Install Stripe in this project:
   ```bash
   npm install stripe @stripe/stripe-js
   ```
4. Add to `.env.local` (and Vercel env vars):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_LIFETIME_PRICE_ID=price_...
   ```
5. Create an API route `src/app/api/checkout/route.ts` that calls
   `stripe.checkout.sessions.create(...)` and redirects to the Stripe
   checkout. Wire it to the **Go Pro** / **Get lifetime** buttons.

Total time to a live, charging site: under one afternoon.

### Margins

- Cost per letter (DeepSeek V3.2): **~$0.00007**
- Pro tier: $9 / month → if user generates 100 letters / month, cost = $0.007 → margin = **99.9%**
- Lifetime tier: $49 one-time → even if user generates 5,000 letters lifetime, cost = $0.35 → margin = **99.3%**

---

## Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local — set DEEPSEEK_API_KEY=sk-...
npm run dev
# open http://localhost:3000
```

## Building the static demo (no API)

```bash
NEXT_PUBLIC_DEMO_MODE=true npm run build
# upload ./out to any static host (Devin, GitHub Pages, S3, Cloudflare Pages…)
```

---

## Marketing & first dollar

Where to find your first customers, free:

- **Reddit**: r/jobs, r/resumes, r/cscareerquestions (read each sub's rules
  first — most ban self-promotion, but allow helpful tools mentioned in
  context).
- **LinkedIn**: post your own job-search story and the tool you built.
- **TikTok**: 30-second "watch me write a cover letter in 20 seconds"
  screencasts. This is currently the highest-leverage channel for tools like
  this.
- **Indie Hackers + Product Hunt**: launch threads.
- **Direct outreach**: DM career coaches on Instagram — offer them a free
  Lifetime in exchange for a story / referral.

Realistic timeline: first paying customer in 1–3 weeks if you post daily.

---

## Project structure

```
src/
  app/
    api/generate/route.ts   # POST /api/generate → calls DeepSeek (OpenAI-compatible)
    layout.tsx              # root layout (fonts, html shell)
    page.tsx                # landing + generator + pricing
    globals.css             # Tailwind v4 + brand tokens
next.config.ts              # toggles static export via NEXT_PUBLIC_DEMO_MODE
```

## License

MIT — yours to use, modify, and ship.
