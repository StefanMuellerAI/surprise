import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

function section(title: string, lines: string[]): string {
  if (lines.length === 0) return "";
  return `## ${title}\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const kindOrder = ["caveat", "recipe", "idiom", "reference", "note"];
  const sections = kindOrder
    .filter((kind) => byKind.has(kind))
    .map((kind) => {
      const lines = (byKind.get(kind) ?? []).map(
        (e) => `- [${e.title}](${base}/e/${e.slug}): ${e.summary}`,
      );
      return section(`${kind}s`, lines);
    })
    .filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats,
> recipes, idioms, and references. Each entry is one small, well-formed
> piece of context worth loading before tackling a task.

## API

- [List entries](${base}/api/entries): JSON, supports \`?tag=\` and \`?kind=\`
- [Get an entry](${base}/api/entries/{slug}): JSON with raw Markdown and rendered HTML
- [Search](${base}/api/search?q=): token-AND substring search
- [List tags](${base}/api/tags): tags with counts

${sections.join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
