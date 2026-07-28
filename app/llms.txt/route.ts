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

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a public knowledge base of caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before tackling a task.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const kindEntries = entries.filter((e) => e.kind === kind);
    if (kindEntries.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`);
    for (const e of kindEntries) {
      const notes = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${base}/api/entries/${e.slug})${notes}`);
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push(`- [All entries (JSON)](${base}/api/entries)`);
  lines.push(`- [Search (JSON)](${base}/api/search?q=)`);
  lines.push(`- [Tags (JSON)](${base}/api/tags)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
