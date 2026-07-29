import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export function GET() {
  const entries = getAllEntries();

  const bySlug = entries
    .map((e) => `- [${e.title}](/api/entries/${e.slug}): ${e.summary}`)
    .join("\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references. Each entry is one small, well-formed piece of context worth
> loading before tackling a task.

Fetch \`/api/entries/{slug}\` for an entry's full Markdown body, or
\`/api/entries\` for the whole corpus. All API responses are JSON with open
CORS.

## API

- [List entries](/api/entries): all entries, metadata only; supports
  \`?tag=\` and \`?kind=\` filters
- [Search](/api/search?q=): token-AND substring search across title,
  summary, tags, and body
- [Tags](/api/tags): all tags with usage counts

## Entries

${bySlug}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
