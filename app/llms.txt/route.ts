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

export function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    const items = inKind
      .map((e) => `- [${e.title}](${SITE}/e/${e.slug}): ${e.summary || e.kind}`)
      .join("\n");
    return `## ${KIND_LABEL[kind]}\n\n${items}`;
  }).filter((s): s is string => s !== null);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references
> worth loading before starting a task.

Full corpus as JSON: ${SITE}/api/entries — single entry: ${SITE}/api/entries/{slug}

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
