import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });

  const body = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "nok",
          product_data: {
            name: "Kakebestilling depositum - T&D Bakeri",
            description: `Depositum for bestillingskake. Henting: ${body.pickupDate} kl. ${body.pickupTime}`,
            images: [`${baseUrl}/images/logo.png`],
          },
          unit_amount: 20000,
        },
        quantity: 1,
      },
    ],
    metadata: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      pickupDate: body.pickupDate,
      pickupTime: body.pickupTime,
      description: body.description,
      size: body.size ?? "",
      message: body.message ?? "",
    },
    customer_email: body.email,
    success_url: `${baseUrl}/bestill-kake/takk?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/bestill-kake?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
