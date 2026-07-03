import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_LABEL: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER = ["caveat", "recipe", "idiom", "reference", "note"];

export async function GET() {
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const kind of KIND_ORDER) byKind.set(kind, []);
  for (const e of entries) {
    if (!byKind.has(e.kind)) byKind.set(e.kind, []);
    byKind.get(e.kind)!.push(e);
  }

  const sections = KIND_ORDER.filter((k) => (byKind.get(k) ?? []).length > 0)
    .map((kind) => {
      const items = byKind
        .get(kind)!
        .map(
          (e) =>
            `- [${e.title}](${BASE_URL}/api/entries/${e.slug}): ${e.summary || "(no summary)"}`,
        )
        .join("\n");
      return `## ${KIND_LABEL[kind] ?? kind}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before tackling a task.

Fetch a full entry (raw Markdown + rendered HTML) at \`${BASE_URL}/api/entries/{slug}\`. List or filter all entries at \`${BASE_URL}/api/entries\` (\`?tag=\`, \`?kind=\`). Search with \`${BASE_URL}/api/search?q=\`. All API responses are JSON with open CORS.

${sections}

## Site

- [Full API docs](${BASE_URL}/api): endpoint reference and example responses
- [About](${BASE_URL}/about): what this project is and how to contribute
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
