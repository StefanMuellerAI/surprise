import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_ORDER: EntryKind[] = ["caveat", "recipe", "idiom", "reference", "note"];

const KIND_PLURAL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore",
    "",
    "> A public knowledge base for AI coding agents: caveats, recipes, idioms, references, and notes.",
    "",
    "Fetch individual entries as JSON via the API, or load this file to get an overview of all available knowledge.",
    "",
    "## API",
    "",
    "- GET /api/entries — list all entries (metadata)",
    "- GET /api/entries/{slug} — single entry with Markdown body and rendered HTML",
    "- GET /api/search?q=... — token-AND search across title, summary, tags, and body",
    "- GET /api/tags — all tags with usage counts",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const section = entries.filter((e) => e.kind === kind);
    if (section.length === 0) continue;

    lines.push(`## ${KIND_PLURAL[kind]}`);
    lines.push("");
    for (const e of section) {
      const tags = e.tags.length > 0 ? ` [${e.tags.join(", ")}]` : "";
      lines.push(`- [${e.title}](/e/${e.slug}): ${e.summary}${tags}`);
    }
    lines.push("");
  }

  lines.push(`_${entries.length} entr${entries.length === 1 ? "y" : "ies"} total. Updated dynamically from source._`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
