import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// llms.txt: a plain-text index so agents can discover every entry in one fetch.
// Paths are site-relative because the route is prerendered (no request origin).
export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Search: /api/search?q=<query>`,
    `All entries (JSON): /api/entries`,
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
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
