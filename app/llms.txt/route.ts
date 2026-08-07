import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [];
  lines.push("# agentlore");
  lines.push("");
  lines.push(
    "> Field notes for AI coding agents — a public knowledge base of caveats, recipes, idioms, and references.",
  );
  lines.push("");
  lines.push(
    `Each entry is one small, well-formed piece of context worth loading before a task. Full text of every entry: ${SITE}/llms-full.txt — JSON API docs: ${SITE}/api`,
  );

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("");
    lines.push(`## ${KIND_LABEL[kind]}`);
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/e/${e.slug})${summary}`);
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
