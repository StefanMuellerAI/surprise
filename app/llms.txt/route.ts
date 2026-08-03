import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const entryLines = entries
    .map((e) => {
      const desc = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${BASE_URL}/e/${e.slug})${desc}`;
    })
    .join("\n");

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats,
> recipes, idioms, and references. Each entry is one small, well-formed
> piece of context worth loading before tackling a task.

## API

- [List entries](${BASE_URL}/api/entries): GET, supports \`?tag=\` and \`?kind=\` filters
- [Single entry](${BASE_URL}/api/entries/{slug}): metadata, raw Markdown, and rendered HTML
- [Search](${BASE_URL}/api/search?q=): token-AND substring search across title, summary, tags, body
- [Tags](${BASE_URL}/api/tags): all tags with usage counts

All API responses are JSON with \`Access-Control-Allow-Origin: *\`.

## Entries

${entryLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
