import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

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
      const lines = list.map(
        (e) => `- [${e.title}](${SITE_URL}/e/${e.slug}): ${e.summary}`,
      );
      return `## ${kind}\n\n${lines.join("\n")}`;
    });

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references. Each entry is one small, well-formed piece of context worth
> loading before tackling a task.

Full JSON API: ${SITE_URL}/api/entries (add ?tag= or ?kind= to filter).
Single entry as JSON or Markdown: ${SITE_URL}/api/entries/{slug}

${sections.join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
