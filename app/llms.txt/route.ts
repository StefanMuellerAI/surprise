import { getAllEntries, toMeta } from "@/lib/entries";
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
  const entries = getAllEntries().map(toMeta);

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references. One small, well-formed piece of context per entry.",
    "",
    `## API`,
    "",
    "- [All entries (JSON)](/api/entries): supports `?tag=` and `?kind=` filters",
    "- [Search (JSON)](/api/search?q=): token-AND substring search",
    "- [Tags (JSON)](/api/tags): tags with counts",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n").trimEnd() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
