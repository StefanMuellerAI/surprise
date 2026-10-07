import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

// Plain-text index following the llms.txt convention, so agents can discover
// every entry with a single request.
export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    "Each entry is also available as JSON at /api/entries/{slug}.",
    "",
    "## Entries",
    "",
    ...getAllEntries().map((e) => {
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${BASE}/api/entries/${e.slug}) (${e.kind})${summary}`;
    }),
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
