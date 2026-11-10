import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// https://llmstxt.org — index of all entries for LLM agents.
export function GET() {
  const base = "https://agentlore.dev";
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references. Each entry is one small, self-contained piece of context.",
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${base}/api/entries/${e.slug}): [${e.kind}] ${e.summary}`,
    ),
    "",
    "## Optional",
    "",
    `- [Full content](${base}/llms-full.txt): every entry in one markdown file`,
    `- [JSON API](${base}/api): search, filter by tag or kind`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
