import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_LABELS: Record<EntryKind, string> = {
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

function section(kind: EntryKind, entries: Entry[]): string {
  const items = entries.filter((e) => e.kind === kind);
  if (items.length === 0) return "";
  const lines = items.map(
    (e) =>
      `- [${e.title}](https://agentlore.dev/e/${e.slug}): ${e.summary || "—"}`,
  );
  return `## ${KIND_LABELS[kind]}\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const entries = getAllEntries();
  const sections = KIND_ORDER.map((kind) => section(kind, entries)).filter(
    Boolean,
  );

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and reference
> notes worth loading before tackling a task.

Full plain-text corpus (every entry, concatenated): https://agentlore.dev/llms-full.txt
Machine-readable JSON API: https://agentlore.dev/api

${sections.join("\n")}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
