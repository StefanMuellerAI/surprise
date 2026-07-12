import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_LABELS: Record<EntryKind, string> = {
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

function linkLine(entry: Entry): string {
  const summary = entry.summary.trim();
  return `- [${entry.title}](${BASE_URL}/e/${entry.slug})${summary ? `: ${summary}` : ""}`;
}

export async function GET() {
  const entries = getAllEntries();
  const byKind = new Map<EntryKind, Entry[]>();
  for (const entry of entries) {
    const list = byKind.get(entry.kind) ?? [];
    list.push(entry);
    byKind.set(entry.kind, list);
  }

  const sections = KIND_ORDER.filter((kind) => byKind.has(kind))
    .map((kind) => {
      const lines = byKind.get(kind)!.map(linkLine).join("\n");
      return `## ${KIND_LABELS[kind]}\n\n${lines}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base and JSON API of
> caveats, recipes, idioms, and references. Each entry is one small,
> well-formed piece of context worth loading before tackling a task.

${sections}

## API

- [Entry list](${BASE_URL}/api/entries): all entries as JSON, filterable by \`?tag=\` and \`?kind=\`
- [Single entry](${BASE_URL}/api/entries/{slug}): one entry with rendered HTML
- [Search](${BASE_URL}/api/search?q=...): token-AND substring search across entries
- [Tags](${BASE_URL}/api/tags): tags with counts
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
