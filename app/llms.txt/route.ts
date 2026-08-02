import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    const links = inKind
      .map((e) => `- [${e.title}](/api/entries/${e.slug}): ${e.summary}`)
      .join("\n");
    return `## ${KIND_LABELS[kind]}\n\n${links}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.

Each linked entry resolves to a JSON document with the full markdown body,
rendered HTML, tags, and related entries. Load an entry before tackling a
task it covers.

${sections.join("\n\n")}

## API

- [List entries](/api/entries): all entries, filterable with \`?tag=\` and \`?kind=\`
- [Search](/api/search?q=): token-AND substring search, e.g. \`?q=...\`
- [Tags](/api/tags): tags with counts
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
