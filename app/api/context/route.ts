import { getAllEntries, formatContextBundle } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KNOWN_KINDS: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const kindParam = url.searchParams.get("kind");

  let entries = getAllEntries();
  if (tag) entries = entries.filter((e) => e.tags.includes(tag));
  if (kindParam && (KNOWN_KINDS as readonly string[]).includes(kindParam)) {
    entries = entries.filter((e) => e.kind === kindParam);
  }

  const date = new Date().toISOString().slice(0, 10);
  const body = formatContextBundle(entries, date);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
