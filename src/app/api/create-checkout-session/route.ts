import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { orderId, amount, designName, customerEmail } = await request.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sar",
            product_data: {
              name: `Invitea - ${designName || "Custom Design"}`,
              description: "Digital invitation design and delivery",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${appUrl}/order/cancel?order_id=${orderId}`,
      customer_email: customerEmail,
      metadata: {
        order_id: orderId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
