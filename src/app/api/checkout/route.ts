import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const PLAN_TO_PRICE_ENV = {
  pro: "STRIPE_PRO_PRICE_ID",
  lifetime: "STRIPE_LIFETIME_PRICE_ID",
} as const;

type Plan = keyof typeof PLAN_TO_PRICE_ENV;

const isPlan = (value: unknown): value is Plan =>
  value === "pro" || value === "lifetime";

interface CheckoutBody {
  plan?: unknown;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        detail:
          "Server is missing STRIPE_SECRET_KEY. Set it in your Vercel project settings and redeploy.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  if (!isPlan(body.plan)) {
    return NextResponse.json(
      { detail: "Body must include plan: 'pro' or 'lifetime'." },
      { status: 400 },
    );
  }

  const priceEnv = PLAN_TO_PRICE_ENV[body.plan];
  const priceId = process.env[priceEnv];
  if (!priceId) {
    return NextResponse.json(
      { detail: `Server is missing ${priceEnv}.` },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secret);

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: body.plan === "lifetime" ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel#pricing`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { detail: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { detail: `Stripe checkout failed: ${msg}` },
      { status: 502 },
    );
  }
}
