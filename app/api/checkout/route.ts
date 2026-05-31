import { NextRequest, NextResponse } from "next/server";
import { stripe, SWITCH_PACK_PRICE_ID } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://shorterwait.org";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: SWITCH_PACK_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/switch-pack/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    locale: "en-GB",
    payment_method_types: ["card"],
    metadata: { product: "switch_pack" },
  });

  return NextResponse.json({ url: session.url });
}
