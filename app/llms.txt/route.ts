import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// Agent-friendly index following the llms.txt convention: one line per entry,
// linking to the JSON endpoint that carries the raw Markdown body.
export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    "Search: GET /api/search?q=<query>. List: GET /api/entries?tag=&kind=.",
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](/api/entries/${e.slug}) (${e.kind}): ${e.summary}`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
