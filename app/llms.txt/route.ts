import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
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

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Public website and JSON API.",
    "",
    "Fetch an entry's full content (frontmatter + raw markdown + rendered " +
      `HTML) via \`GET ${SITE}/api/entries/{slug}\`. List all entries: ` +
      `\`GET ${SITE}/api/entries\`. Search: \`GET ${SITE}/api/search?q=...\`. ` +
      `Tags: \`GET ${SITE}/api/tags\`.`,
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/api/entries/${e.slug})${desc}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n").trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
