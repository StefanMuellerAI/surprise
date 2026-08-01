import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

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
  if (entries.length === 0) return "";
  const items = entries
    .map((e) => {
      const desc = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${BASE_URL}/e/${e.slug})${desc}`;
    })
    .join("\n");
  return `\n## ${KIND_LABEL[kind]}\n\n${items}\n`;
}

export function GET() {
  const entries = getAllEntries();
  const sections = KIND_ORDER.map((kind) =>
    section(
      kind,
      entries.filter((e) => e.kind === kind),
    ),
  ).join("");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references worth loading before a task. Content is CC BY 4.0; also available as JSON via the API below.

- [JSON API](${BASE_URL}/api): list, fetch, and search entries programmatically
- [All entries](${BASE_URL}/api/entries): full metadata for every entry as JSON
${sections}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
