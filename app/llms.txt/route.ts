import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references. Each entry is a small, self-contained piece of context worth loading before a task.",
    "",
    "## API",
    "",
    `- [All entries (JSON)](${BASE}/api/entries): filter with ?tag= or ?kind=`,
    `- [Search (JSON)](${BASE}/api/search?q=): full-text search`,
    `- [Tags (JSON)](${BASE}/api/tags)`,
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) =>
        `- [${e.title}](${BASE}/api/entries/${e.slug})${e.summary ? `: ${e.summary}` : ""}`,
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
