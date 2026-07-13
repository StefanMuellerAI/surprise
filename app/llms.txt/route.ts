import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

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

export function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and",
    "> references, one small well-formed entry at a time.",
    "",
    `Machine-readable index for LLM agents. Fetch a single entry (with raw`,
    `markdown body) at ${SITE_URL}/api/entries/{slug}, or the whole corpus`,
    `at ${SITE_URL}/api/entries. See ${SITE_URL}/api for the full API.`,
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`, "");
    for (const e of inKind) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE_URL}/e/${e.slug})${desc}`);
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
