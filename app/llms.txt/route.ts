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
    const inKind = entries
      .filter((e) => e.kind === kind)
      .sort((a, b) => a.title.localeCompare(b.title));
    if (inKind.length === 0) return null;
    const links = inKind
      .map((e) => `- [${e.title}](${SITE}/e/${e.slug}): ${e.summary}`)
      .join("\n");
    return `## ${KIND_LABELS[kind]}\n\n${links}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.
> Each entry is one small, well-formed piece of context worth loading before a task.

Full-text JSON API at ${SITE}/api (GET /api/entries, /api/entries/{slug}, /api/search?q=, /api/tags).
The entire corpus concatenated as plain markdown, ready to paste into context, is at ${SITE}/llms-full.txt.

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
