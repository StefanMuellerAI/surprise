import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export function GET() {
  const entries = getAllEntries();
  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references.",
    "",
    "Each entry is one small, well-formed piece of context: the kind of thing " +
      "worth loading before tackling a task. Full JSON API at " +
      `${SITE}/api. Full plain-text corpus at ${SITE}/llms-full.txt.`,
    "",
  ];

  for (const [kind, list] of byKind) {
    lines.push(`## ${KIND_LABEL[kind] ?? kind}`, "");
    for (const e of list) {
      lines.push(`- [${e.title}](${SITE}/e/${e.slug}): ${e.summary}`);
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
