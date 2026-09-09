import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER: EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

function section(kind: EntryKind, entries: Entry[]): string {
  if (entries.length === 0) return "";
  const lines = entries.map((e) => {
    const note = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE}/e/${e.slug})${note}`;
  });
  return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}\n`;
}

export function GET() {
  const entries = getAllEntries();
  const byKind = new Map<EntryKind, Entry[]>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const sections = KIND_ORDER.map((kind) =>
    section(kind, byKind.get(kind) ?? []),
  ).filter(Boolean);

  const body = [
    "# agentlore",
    "",
    "> A small, growing knowledge base of caveats, recipes, and idioms for AI coding agents — the kind of pre-flight context worth loading before a task.",
    "",
    `Full JSON API at ${SITE}/api. Every entry below is also available as Markdown/JSON at ${SITE}/api/entries/{slug}.`,
    "",
    ...sections,
    "## API",
    "",
    `- [JSON API docs](${SITE}/api)`,
    `- [All entries](${SITE}/api/entries): GET, optionally filtered with ?tag= or ?kind=`,
    `- [Search](${SITE}/api/search?q=): token-AND substring search`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
