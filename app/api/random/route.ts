import { NextResponse } from "next/server";
import { getRandomEntry, renderEntry } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KNOWN_KINDS: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const kindParam = url.searchParams.get("kind");
  const kind =
    kindParam && (KNOWN_KINDS as readonly string[]).includes(kindParam)
      ? (kindParam as EntryKind)
      : null;

  const entry = getRandomEntry({ tag, kind });
  if (!entry) {
    return NextResponse.json(
      { error: "not_found" },
      {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
  }

  const rendered = await renderEntry(entry);
  return NextResponse.json(
    { ...rendered, body: entry.body },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    },
  );
}
