import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { readHours, writeHours } from "@/lib/hours";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readHours());
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const current = readHours();
  const updated = { ...current, ...body };
  writeHours(updated);
  return NextResponse.json({ ok: true });
}
