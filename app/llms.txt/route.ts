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

// https://llmstxt.org — a plain-text index so agents can load the whole
// corpus (or decide what to fetch) without crawling HTML.
export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry is one small, well-formed piece of context " +
      "worth loading before a task.",
    "",
    "## API",
    "",
    "- [List entries](/api/entries): JSON, supports `?tag=` and `?kind=` filters",
    "- [Single entry](/api/entries/{slug}): JSON with rendered HTML",
    "- [Search](/api/search?q=): token-AND substring search",
    "- [Tags](/api/tags): tags with counts",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push("", `## ${KIND_LABEL[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/e/${e.slug})${summary}`);
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
