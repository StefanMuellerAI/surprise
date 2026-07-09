import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_LABELS: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export function GET() {
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = byKind.get(entry.kind) ?? [];
    list.push(entry);
    byKind.set(entry.kind, list);
  }

  const sections = [...byKind.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kind, kindEntries]) => {
      const heading = KIND_LABELS[kind] ?? kind;
      const items = kindEntries
        .map(
          (e) =>
            `- [${e.title}](${BASE_URL}/e/${e.slug}): ${e.summary || "(no summary)"}`,
        )
        .join("\n");
      return `## ${heading}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — a public website and JSON API of
> caveats, recipes, idioms, and references. Each entry is one small,
> well-formed piece of context worth loading before tackling a task.

## API

- [List entries](${BASE_URL}/api/entries): JSON, supports \`?tag=\` and \`?kind=\`
- [Single entry](${BASE_URL}/api/entries/{slug}): JSON with rendered HTML and raw markdown body
- [Search](${BASE_URL}/api/search?q=...): token-AND substring search
- [Tags](${BASE_URL}/api/tags): tags with counts

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
