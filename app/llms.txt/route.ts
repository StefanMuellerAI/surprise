import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

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

export function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    const lines = inKind.map(
      (e) =>
        `- [${e.title}](/api/entries/${e.slug}/raw)${e.summary ? `: ${e.summary}` : ""}`,
    );
    return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each linked entry is one small, well-formed piece of context, served as plain markdown.

${sections.join("\n\n")}

## Full index

- [All entries as JSON](/api/entries)
- [Search](/api/search?q=)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
