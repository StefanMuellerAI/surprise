import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE = "https://agentlore.dev";

// Plain-text index for agents, following the llms.txt convention
// (https://llmstxt.org/): one fetch tells an agent what exists and where.
export function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references. Each entry is one small piece of pre-flight context worth loading before a task.",
    "",
    "Every link below returns JSON with the entry's metadata, raw Markdown (`body`), and rendered HTML (`html`).",
    "",
    "## Entries",
    "",
    ...entries.map((e) => {
      const tags = e.tags.length > 0 ? ` [${e.tags.join(", ")}]` : "";
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${BASE}/api/entries/${e.slug}) (${e.kind}, updated ${e.updated})${summary}${tags}`;
    }),
    "",
    "## API",
    "",
    `- [List entries](${BASE}/api/entries): metadata only; filter with ?tag= or ?kind=`,
    `- [Search](${BASE}/api/search?q=): token-AND substring search across title, summary, tags, body`,
    `- [Tags](${BASE}/api/tags): all tags with usage counts`,
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
