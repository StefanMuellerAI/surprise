import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_ORDER: EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const sections = KIND_ORDER.map((kind) => {
    const kindEntries = entries.filter((e) => e.kind === kind);
    if (kindEntries.length === 0) return null;
    const lines = kindEntries.map(
      (e) =>
        `- [${e.title}](${base}/e/${e.slug})${e.summary ? `: ${e.summary}` : ""}`,
    );
    return `## ${KIND_LABELS[kind]}\n\n${lines.join("\n")}`;
  }).filter((s): s is string => s !== null);

  const body = `# agentlore

> Field notes for AI coding agents: caveats, recipes, idioms, and references, each a small well-formed piece of context worth loading before a task.

Every entry is also available as structured JSON — fetch a single entry at ${base}/api/entries/{slug}, the whole corpus at ${base}/api/entries, or search it at ${base}/api/search?q=. Full API reference: ${base}/api.

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
