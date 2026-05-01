import { NextRequest, NextResponse } from "next/server";
import { sendRegularOrderNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, orderType, items, total, pickupTime, notes } = body;

  if (!name || !phone || !orderType || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Mangler påkravde felt" }, { status: 400 });
  }

  const orderId = `ORD-${Date.now()}`;

  try {
    await sendRegularOrderNotification({ name, phone, orderType, items, total, pickupTime, notes, orderId });
  } catch (e) {
    console.error("Order notification error:", e);
  }

  return NextResponse.json({ success: true, orderId });
}
