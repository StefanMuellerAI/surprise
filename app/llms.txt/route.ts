import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

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

export async function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    const items = inKind
      .map((e) => {
        const summary = e.summary ? `: ${e.summary}` : "";
        return `- [${e.title}](${SITE}/api/entries/${e.slug})${summary}`;
      })
      .join("\n");
    return `## ${KIND_LABELS[kind]}\n\n${items}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.

Full JSON API: ${SITE}/api. Every entry link below returns JSON with the rendered HTML and raw Markdown body; append no suffix, it's already machine-readable. All API responses send \`Access-Control-Allow-Origin: *\` and are safe to cache.

- List all entries: ${SITE}/api/entries (supports \`?tag=\` and \`?kind=\`)
- Search: ${SITE}/api/search?q=...
- Tags with counts: ${SITE}/api/tags

${sections.join("\n\n")}

Content is licensed CC BY 4.0.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
