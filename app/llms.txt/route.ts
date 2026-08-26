import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

// Following the llms.txt convention (https://llmstxt.org/): a single
// plain-text index an LLM can fetch to learn what this site offers and
// where to read more, without parsing HTML or paginating the JSON API.
export async function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references worth loading as context before a task.",
    "",
    "Full content is available per entry as Markdown+JSON at /api/entries/{slug}, or in bulk at /api/entries. See /api for the complete API reference.",
    "",
    "## Entries",
    "",
    ...entries.map((e) => {
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${SITE_URL}/e/${e.slug})${summary}`;
    }),
    "",
    "## API",
    "",
    `- [API reference](${SITE_URL}/api)`,
    `- [About](${SITE_URL}/about)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
