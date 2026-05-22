import { NextResponse } from "next/server";
import { getAllEntries, toMeta } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KNOWN_KINDS: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const kindParam = url.searchParams.get("kind");

  let entries = getAllEntries();
  if (tag) entries = entries.filter((e) => e.tags.includes(tag));
  if (kindParam && (KNOWN_KINDS as readonly string[]).includes(kindParam)) {
    entries = entries.filter((e) => e.kind === kindParam);
  }

  return NextResponse.json(
    {
      count: entries.length,
      entries: entries.map(toMeta),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}
