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

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "reference notes worth loading before a task. Machine-readable JSON " +
      "API available; see /api and /llms-full.txt for the complete corpus " +
      "in one file.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/api/entries/${e.slug})${summary}`);
    }
    lines.push("");
  }

  lines.push(
    "## API",
    "",
    `- [JSON API reference](${SITE}/api)`,
    `- [List all entries](${SITE}/api/entries)`,
    `- [Search](${SITE}/api/search?q=)`,
    `- [Tags](${SITE}/api/tags)`,
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
