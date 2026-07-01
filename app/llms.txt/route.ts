import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_LABELS: Record<EntryKind, string> = {
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

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry is one small, well-formed piece of context. " +
      "Also available as JSON via /api/entries.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`, "");
    for (const e of inKind) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/api/entries/${e.slug})${desc}`);
    }
    lines.push("");
  }

  lines.push(
    "## API",
    "",
    "- [/api/entries](/api/entries): list all entries as JSON, supports ?tag= and ?kind=",
    "- [/api/search](/api/search?q=): token-AND substring search, ?q=",
    "- [/api/tags](/api/tags): tags with counts",
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
