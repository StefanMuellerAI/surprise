import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const sections = [...byKind.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kind, list]) => {
      const items = list
        .map((e) => `- [${e.title}](${BASE_URL}/e/${e.slug}): ${e.summary}`)
        .join("\n");
      return `## ${kind}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats,
> recipes, idioms, and references. Each entry is one small, well-formed
> piece of context worth loading before tackling a task.

${sections}

## API

- [API docs](${BASE_URL}/api): overview of all endpoints
- [List entries](${BASE_URL}/api/entries): JSON, supports \`?tag=\` and \`?kind=\`
- [Fetch an entry](${BASE_URL}/api/entries/{slug}): JSON with full Markdown body
- [Search](${BASE_URL}/api/search?q=...): token-AND substring search
- [List tags](${BASE_URL}/api/tags): tags with usage counts
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
