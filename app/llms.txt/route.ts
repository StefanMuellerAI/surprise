import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Full corpus as one Markdown document: ${BASE}/llms-full.txt`,
    `JSON API: ${BASE}/api`,
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) =>
        `- [${e.title}](${BASE}/api/entries/${e.slug}) (${e.kind})${e.summary ? `: ${e.summary}` : ""}`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
