import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const sections = [...byKind.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([kind, list]) => {
      const items = list
        .map(
          (e) =>
            `- [${e.title}](${SITE}/api/entries/${e.slug}): ${e.summary}`,
        )
        .join("\n");
      return `## ${kind}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references, as a public knowledge base and JSON API. Each linked entry resolves to JSON with the full Markdown body.

## API

- [List entries](${SITE}/api/entries): all entries as JSON, supports \`?tag=\` and \`?kind=\`
- [Search](${SITE}/api/search?q=): token-AND substring search across title, summary, tags, body
- [Tags](${SITE}/api/tags): all tags with usage counts

${sections}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
