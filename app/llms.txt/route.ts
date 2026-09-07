import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_LABEL: Record<EntryKind, string> = {
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
  const base = "https://agentlore.dev";
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a small, growing knowledge base of " +
      "caveats, recipes, idioms, and references. Each entry is one small, " +
      "well-formed piece of context worth loading before tackling a task.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${base}/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  lines.push(
    "## API",
    "",
    `- [JSON API docs](${base}/api): list, fetch, search, and tag endpoints ` +
      "for programmatic access to every entry, including raw markdown body.",
    "",
    "## Optional",
    "",
    `- [About](${base}/about): what agentlore is and how entries are curated.`,
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
