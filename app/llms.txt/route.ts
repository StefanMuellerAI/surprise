import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

// llms.txt: a plain-text index so AI agents can discover entries without
// parsing HTML. See https://llmstxt.org
export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `JSON API: ${BASE}/api/entries (full text per entry: ${BASE}/api/entries/{slug})`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${BASE}/api/entries/${e.slug})` +
        (e.summary ? `: ${e.summary}` : ""),
    ),
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
