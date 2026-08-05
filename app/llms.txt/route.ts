import { getAllEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export async function GET() {
  const origin = SITE_URL;
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry is one small, well-formed piece of context " +
      "worth loading before tackling a task.",
    "",
    `Full JSON API docs: ${origin}/api`,
    `All entries (JSON): GET ${origin}/api/entries`,
    `Search: GET ${origin}/api/search?q=<query>`,
  ];

  for (const kind of KIND_ORDER) {
    const group = entries.filter((e) => e.kind === kind);
    if (group.length === 0) continue;
    lines.push("", `## ${KIND_LABELS[kind]}`, "");
    for (const e of group) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${origin}/api/entries/${e.slug})${desc}`);
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
