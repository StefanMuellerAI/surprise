import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};

const KIND_ORDER: EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

function entryLine(e: Entry): string {
  const summary = e.summary ? `: ${e.summary}` : "";
  return `- [${e.title}](${SITE_URL}/e/${e.slug})${summary}`;
}

export function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    return [`## ${KIND_LABEL[kind]}`, "", ...inKind.map(entryLine), ""].join(
      "\n",
    );
  }).filter((s): s is string => s !== null);

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.",
    "",
    ...sections,
    "## API",
    "",
    `- [JSON API docs](${SITE_URL}/api): list, fetch, and search entries as JSON`,
    `- [GET /api/entries](${SITE_URL}/api/entries): all entries, supports ?tag= and ?kind=`,
    `- [GET /api/search?q=](${SITE_URL}/api/search): full-text search across entries`,
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
