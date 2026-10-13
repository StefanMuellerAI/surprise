import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

export async function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references. Each entry is a small, self-contained piece of context worth loading before a task.",
    "",
    "## API",
    "",
    `- [All entries](${BASE}/api/entries): metadata as JSON`,
    `- [Search](${BASE}/api/search?q=): token-AND search over title, summary, tags, body`,
    `- [Tags](${BASE}/api/tags): tags with usage counts`,
    `- Single entry: ${BASE}/api/entries/{slug} (Markdown body + rendered HTML)`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${BASE}/api/entries/${e.slug}) (${e.kind})${e.summary ? `: ${e.summary}` : ""}`,
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
