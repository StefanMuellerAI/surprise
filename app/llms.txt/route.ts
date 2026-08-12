import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

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

export async function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    const lines = inKind.map((e) => {
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${SITE}/e/${e.slug})${summary}`;
    });
    return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats,
> recipes, idioms, and references. Each entry is one short, well-formed
> piece of context worth loading before starting a task.

Full corpus in one fetch: ${SITE}/llms-full.txt
JSON API: ${SITE}/api/entries (also ${SITE}/api/entries/{slug}, ${SITE}/api/search?q=, ${SITE}/api/tags)

${sections.join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
