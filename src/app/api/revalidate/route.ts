import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/** Prismic webhook target: refreshes all cached Prismic content after a publish. */
export async function POST() {
  revalidateTag("prismic", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
