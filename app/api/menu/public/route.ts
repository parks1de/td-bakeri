import { NextResponse } from "next/server";
import { getVisibleMenu } from "@/lib/menu";
export const dynamic = "force-dynamic";
export function GET() { return NextResponse.json(getVisibleMenu()); }
