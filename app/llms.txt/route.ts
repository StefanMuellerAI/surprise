import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

const KIND_SECTIONS: { kind: EntryKind; heading: string }[] = [
  { kind: "caveat", heading: "Caveats" },
  { kind: "recipe", heading: "Recipes" },
  { kind: "idiom", heading: "Idioms" },
  { kind: "reference", heading: "References" },
  { kind: "note", heading: "Notes" },
];

function toLine(e: Entry): string {
  const summary = e.summary.replace(/\s+/g, " ").trim();
  return summary
    ? `- [${e.title}](${SITE_URL}/e/${e.slug}): ${summary}`
    : `- [${e.title}](${SITE_URL}/e/${e.slug})`;
}

export function GET() {
  const entries = getAllEntries();

  const sections = KIND_SECTIONS.map(({ kind, heading }) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    return `## ${heading}\n\n${inKind.map(toLine).join("\n")}`;
  }).filter(Boolean);

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references worth loading before tackling a task.",
    "",
    `Full JSON API at ${SITE_URL}/api (CORS open, cacheable). Fetch a single entry's raw Markdown via ${SITE_URL}/api/entries/{slug}.`,
    "",
    "## API",
    "",
    `- [JSON API index](${SITE_URL}/api): list of machine-readable endpoints for entries, search, and tags.`,
    ...sections.map((s) => `\n${s}`),
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
