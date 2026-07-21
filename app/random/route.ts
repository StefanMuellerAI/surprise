import { NextResponse } from "next/server";
import { getRandomEntry } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const entry = getRandomEntry();
  if (!entry) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.redirect(new URL(`/e/${entry.slug}`, req.url));
}
