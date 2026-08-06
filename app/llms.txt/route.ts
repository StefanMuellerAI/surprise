import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_LABELS: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};

const KIND_ORDER = ["caveat", "recipe", "idiom", "reference", "note"];

export async function GET() {
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = byKind.get(entry.kind) ?? [];
    list.push(entry);
    byKind.set(entry.kind, list);
  }

  const sections = KIND_ORDER.filter((kind) => byKind.has(kind))
    .map((kind) => {
      const list = byKind.get(kind)!.sort((a, b) => a.title.localeCompare(b.title));
      const items = list
        .map(
          (e) =>
            `- [${e.title}](${BASE_URL}/api/entries/${e.slug}): ${e.summary}`,
        )
        .join("\n");
      return `## ${KIND_LABELS[kind] ?? kind}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before tackling a task.

Fetch a single entry as JSON (with rendered HTML and raw markdown body) at the link for that entry. Bulk endpoints: ${BASE_URL}/api/entries (all metadata), ${BASE_URL}/api/search?q=... (search).

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
