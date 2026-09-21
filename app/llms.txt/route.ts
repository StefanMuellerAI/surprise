import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

// https://llmstxt.org/ — a plain-text index so agents can load the corpus
// without crawling HTML.
export async function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a public website and JSON API of caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.",
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) => `- [${e.title}](${SITE_URL}/e/${e.slug}): ${e.summary || e.kind}`,
    ),
    "",
    "## API",
    "",
    `- [GET /api/entries](${SITE_URL}/api/entries): list metadata, supports ?tag= and ?kind=`,
    `- [GET /api/entries/{slug}](${SITE_URL}/api/entries): single entry, with rendered HTML`,
    `- [GET /api/search?q=](${SITE_URL}/api/search): token-AND substring search`,
    `- [GET /api/tags](${SITE_URL}/api/tags): tags with counts`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
