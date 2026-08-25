import { NextResponse } from "next/server";
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

const BASE_URL = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a public, growing knowledge base of caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before tackling a task.",
    "",
    `Full JSON API docs: ${BASE_URL}/api`,
    `List all entries: ${BASE_URL}/api/entries`,
    `Fetch one entry (Markdown + HTML): ${BASE_URL}/api/entries/{slug}`,
    `Search: ${BASE_URL}/api/search?q=...`,
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("", `## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${BASE_URL}/e/${e.slug})${summary}`);
    }
  }

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
