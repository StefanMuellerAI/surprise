import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
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
    "> Field notes for AI coding agents — caveats, recipes, idioms, and",
    "> references. Each entry is one small, well-formed piece of context worth",
    "> loading before tackling a task.",
    "",
    `Full JSON API: ${SITE}/api/entries . Single entry with raw Markdown: ${SITE}/api/entries/{slug} .`,
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("", `## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const note = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/e/${e.slug})${note}`);
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
