import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { readMenu, writeMenu, MenuItem } from "@/lib/menu";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  return auth === process.env.ADMIN_PASSWORD;
}

export function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readMenu());
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const item: MenuItem = await req.json();
  const items = readMenu();
  item.id = Date.now().toString();
  items.push(item);
  writeMenu(items);
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const updated: MenuItem = await req.json();
  const items = readMenu().map((i) => (i.id === updated.id ? updated : i));
  writeMenu(items);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const items = readMenu().filter((i) => i.id !== id);
  writeMenu(items);
  return NextResponse.json({ ok: true });
}
