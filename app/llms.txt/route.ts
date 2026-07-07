import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

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
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    const items = inKind
      .map((e) => `- [${e.title}](${SITE_URL}/e/${e.slug}): ${e.summary}`)
      .join("\n");
    return `## ${KIND_LABELS[kind]}\n\n${items}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references worth loading before a task. One entry is one small, well-formed piece of context.

${sections.join("\n\n")}

## Optional

- [Full corpus in one file](${SITE_URL}/llms-full.txt): every entry's raw Markdown, concatenated
- [JSON API](${SITE_URL}/api/entries): machine-readable listing, filterable by \`tag\` or \`kind\`
- [Search](${SITE_URL}/api/search?q=): token search across title, summary, tags, body
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
