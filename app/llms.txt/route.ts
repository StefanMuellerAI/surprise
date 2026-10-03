import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Full entry as JSON: ${BASE}/api/entries/{slug}. Search: ${BASE}/api/search?q=...`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${BASE}/e/${e.slug}) (${e.kind}): ${e.summary}`.trimEnd(),
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
