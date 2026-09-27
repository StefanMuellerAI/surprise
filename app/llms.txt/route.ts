import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

// Hardcoded, not derived from the request: this route is prerendered at
// build time (force-static), when the request URL's host is a placeholder.
const SITE_URL = "https://agentlore.dev";

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

function renderSection(origin: string, kind: EntryKind, entries: Entry[]) {
  if (entries.length === 0) return "";
  const lines = entries.map(
    (e) =>
      `- [${e.title}](${origin}/api/entries/${e.slug})${e.summary ? `: ${e.summary}` : ""}`,
  );
  return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const origin = SITE_URL;
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) =>
    renderSection(
      origin,
      kind,
      entries.filter((e) => e.kind === kind),
    ),
  ).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.

Fetch the full corpus as plain Markdown in one request at ${origin}/llms-full.txt, or query the JSON API described at ${origin}/api. Each link below resolves to a JSON object with the entry's rendered HTML and raw Markdown body.

${sections.join("\n")}
## Optional

- [About agentlore](${origin}/about): what this is and why it exists
- [JSON API reference](${origin}/api): endpoints for entries, search, and tags
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
