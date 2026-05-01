import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getHoursConfig } from "@/lib/hours";
import type { HoursConfig } from "@/lib/hours";
import { sanityWriteClient } from "@/lib/sanityClient";

const SINGLETON_ID = "singleton-hoursConfig";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getHoursConfig();
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "SANITY_WRITE_TOKEN ikkje konfigurert" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as Partial<HoursConfig>;
  const current = await getHoursConfig();
  const merged: HoursConfig = { ...current, ...body };

  const scheduleArray = Object.entries(merged.schedule).map(([day, val]) => ({
    _key: day,
    day,
    isClosed: val === null,
    openTime: val?.open ?? "09:00",
    closeTime: val?.close ?? "18:00",
  }));

  const manualOverride =
    merged.override === null ? "auto" : merged.override;

  await sanityWriteClient.createIfNotExists({
    _id: SINGLETON_ID,
    _type: "hoursConfig",
    manualOverride: "auto",
    schedule: [],
  });
  await sanityWriteClient
    .patch(SINGLETON_ID)
    .set({ manualOverride, schedule: scheduleArray })
    .commit();

  return NextResponse.json({ ok: true });
}
