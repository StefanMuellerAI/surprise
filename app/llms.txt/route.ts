import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

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

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    const items = inKind
      .map((e) => `- [${e.title}](${base}/e/${e.slug}): ${e.summary}`)
      .join("\n");
    return `## ${KIND_LABEL[kind]}\n\n${items}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.
> Each entry is one small, well-formed piece of context worth loading before
> a task. Full JSON API (list, single entry with Markdown body, search, tags)
> at ${base}/api — CORS open, no auth required.

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
