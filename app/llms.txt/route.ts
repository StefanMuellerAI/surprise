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

const KIND_ORDER: EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export async function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — one small, well-formed piece of " +
      "context per entry: caveats, recipes, idioms, and references worth " +
      "loading before tackling a task.",
    "",
    "## API",
    "",
    "- [List entries](/api/entries): JSON, supports `?tag=` and `?kind=`",
    "- [Search](/api/search?q=): token-AND substring search",
    "- [Tags](/api/tags): tags with counts",
    "- Fetch a single entry as JSON + Markdown: /api/entries/{slug}",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("", `## ${KIND_LABELS[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/api/entries/${e.slug})${summary}`);
    }
  }

  const body = lines.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
