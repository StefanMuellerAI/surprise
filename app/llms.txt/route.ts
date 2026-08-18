import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

function section(kind: EntryKind, entries: Entry[]): string {
  const items = entries.filter((e) => e.kind === kind);
  if (items.length === 0) return "";
  const lines = items.map((e) => {
    const summary = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE}/e/${e.slug})${summary}`;
  });
  return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const entries = getAllEntries();
  const sections = KIND_ORDER.map((k) => section(k, entries)).filter(Boolean);

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Load this file to see what's in the corpus before " +
      "fetching individual entries.",
    "",
    `Full text of every entry, in one file, is at ${SITE}/llms-full.txt. ` +
      `Machine-readable JSON is at ${SITE}/api/entries and ` +
      `${SITE}/api/entries/{slug}.`,
    "",
    ...sections,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
