import { getAllEntries } from "@/lib/entries";
import { SITE_URL, type EntryKind } from "@/lib/types";

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

// https://llmstxt.org/ — a short, link-based index an agent can fetch first;
// /llms-full.txt below has the same corpus inlined for a single-request read.
export async function GET() {
  const origin = SITE_URL;
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and " +
      "references. One short entry per concern, meant to be loaded before " +
      "starting a task.",
    "",
    `Full corpus in one file: ${origin}/llms-full.txt`,
    `JSON API: ${origin}/api/entries`,
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${origin}/e/${e.slug})${summary}`);
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
