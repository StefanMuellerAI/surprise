import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    "JSON API: `GET /api/entries`, `GET /api/entries/{slug}`, `GET /api/search?q=...`, `GET /api/tags`.",
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
