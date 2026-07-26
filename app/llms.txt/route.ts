import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
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
      const lines = list
        .map(
          (e) =>
            `- [${e.title}](https://agentlore.dev/e/${e.slug}): ${e.summary}`,
        )
        .join("\n");
      return `## ${kind}\n\n${lines}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.
> Each entry is one small, well-formed piece of context worth loading before a task.

Full corpus as JSON: https://agentlore.dev/api/entries
Single entry (JSON + rendered HTML): https://agentlore.dev/api/entries/{slug}
Search: https://agentlore.dev/api/search?q=...

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
