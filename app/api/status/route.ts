import { NextResponse } from "next/server";
import { getOpenStatus } from "@/lib/hours";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const status = getOpenStatus();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ isOpen: false, label: "Status utilgjengelig", source: "error" });
  }
}
