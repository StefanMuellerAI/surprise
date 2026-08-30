import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

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
  const base = "https://agentlore.dev";

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    const lines = inKind.map(
      (e) => `- [${e.title}](${base}/e/${e.slug}): ${e.summary}`,
    );
    return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references
> worth loading before a task. Public, versionable, CC BY 4.0.

Fetch the whole corpus as plain Markdown in one request: ${base}/llms-full.txt
Or the JSON API: ${base}/api

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
