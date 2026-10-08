import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a plain-text index agents can fetch first.
export function GET() {
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    "Each entry is available as JSON at /api/entries/{slug}; search with /api/search?q=...",
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
