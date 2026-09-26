import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

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

export const dynamic = "force-static";

function entryLine(e: Entry): string {
  const summary = e.summary ? `: ${e.summary}` : "";
  return `- [${e.title}](${SITE}/api/entries/${e.slug})${summary}`;
}

export async function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    return `## ${KIND_LABEL[kind]}\n\n${inKind.map(entryLine).join("\n")}\n`;
  }).filter(Boolean);

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a public knowledge base of caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.",
    "",
    `Full JSON API (structured, filterable, CORS-open) at ${SITE}/api. Each link below resolves to that entry's JSON, which includes the raw Markdown body.`,
    "",
    ...sections,
  ].join("\n");

  return new NextResponse(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
