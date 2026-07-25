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

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const BASE_URL = "https://agentlore.dev";

// https://llmstxt.org/ — a plain-text index so agents can load the corpus
// without parsing HTML.
export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry is one small, well-formed piece of context " +
      "worth loading before a task.",
    "",
    `JSON API: ${BASE_URL}/api/entries (list), ` +
      `${BASE_URL}/api/entries/{slug} (single), ` +
      `${BASE_URL}/api/search?q= (search).`,
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("", `## ${KIND_LABELS[kind]}`);
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${BASE_URL}/e/${e.slug})${summary}`);
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
