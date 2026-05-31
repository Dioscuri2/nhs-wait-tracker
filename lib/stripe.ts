import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const SWITCH_PACK_PRICE_ID = process.env.SWITCH_PACK_PRICE_ID || "price_1Td2lHEpNyYBy2JChzAhTQmr";
