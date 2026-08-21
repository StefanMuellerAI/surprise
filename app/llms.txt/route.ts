import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [];
  lines.push("# agentlore");
  lines.push("");
  lines.push(
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Fetch a full entry with `GET /api/entries/{slug}`; the " +
      "whole corpus with `GET /api/entries`.",
  );
  lines.push("");

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`);
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push(
    `- [Entries index](${SITE}/api/entries): list metadata, supports ?tag= and ?kind=`,
  );
  lines.push(
    `- [Search](${SITE}/api/search?q=): token-AND substring search across title, summary, tags, body`,
  );
  lines.push(`- [Tags](${SITE}/api/tags): tags with counts`);

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
