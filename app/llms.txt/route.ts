import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a machine-readable index so agents can
// discover the corpus without crawling the HTML site.
export function GET() {
  const entries = getAllEntries();
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references.",
    "",
    "Every entry is available as JSON at `/api/entries/{slug}`; search with `/api/search?q=...`.",
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) =>
        `- [${e.title}](/api/entries/${e.slug})${e.summary ? `: ${e.summary}` : ""} (${e.kind})`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
