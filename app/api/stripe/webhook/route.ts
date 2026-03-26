import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOwnerNotification, sendSmsNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata ?? {};

    const order = {
      name: m.name ?? "",
      phone: m.phone ?? "",
      email: m.email ?? session.customer_email ?? "",
      pickupDate: m.pickupDate ?? "",
      pickupTime: m.pickupTime ?? "",
      description: m.description ?? "",
      size: m.size ?? undefined,
      message: m.message ?? undefined,
      orderId: session.id,
      amount: session.amount_total ?? 20000,
    };

    // Fire both in parallel; SMS is best-effort
    await Promise.allSettled([
      sendOwnerNotification(order),
      sendSmsNotification(order),
    ]);
  }

  return NextResponse.json({ received: true });
}
