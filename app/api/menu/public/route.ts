import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await sanityClient.fetch(`
      *[_type == "menuItem" && available == true] {
        _id,
        title,
        "slug": slug.current,
        "category": {
          "title": category->title,
          "slug": category->slug.current,
          "icon": category->icon,
          "sortOrder": category->sortOrder
        },
        description,
        price,
        "image": image.asset->url,
        allergies,
        variants,
        eatIn,
        takeAway,
        featured
      } | order(category->sortOrder asc, title asc)
    `);
    return NextResponse.json(items ?? []);
  } catch (e) {
    console.error("Sanity menu fetch error:", e);
    return NextResponse.json([]);
  }
}
