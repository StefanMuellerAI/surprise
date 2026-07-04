import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SECTION_TITLE: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and",
    "> references. Each entry is one small, well-formed piece of context worth",
    "> loading before a task. Full corpus also available as JSON via /api.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${SECTION_TITLE[kind]}`);
    for (const e of inKind) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/e/${e.slug})${desc}`);
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push(
    "- [/api/entries](/api/entries): list all entries as JSON (supports ?tag= and ?kind=)",
  );
  lines.push(
    "- [/api/entries/{slug}](/api/entries): single entry with rendered HTML",
  );
  lines.push("- [/api/search?q=](/api/search): token-AND substring search");
  lines.push("- [/api/tags](/api/tags): tags with counts");

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
