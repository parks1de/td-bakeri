import { NextResponse } from "next/server";
import { getOpenStatus } from "@/lib/hours";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getOpenStatus();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({
      isOpen: false,
      statusKey: "status_unavailable",
      source: "error",
    });
  }
}
