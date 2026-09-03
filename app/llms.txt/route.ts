import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

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
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const sections = KIND_ORDER.filter((k) => byKind.has(k))
    .map((k) => {
      const items = (byKind.get(k) ?? [])
        .map((e) => {
          const desc = e.summary ? `: ${e.summary}` : "";
          return `- [${e.title}](${SITE}/e/${e.slug})${desc}`;
        })
        .join("\n");
      return `## ${KIND_LABEL[k]}\n\n${items}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references. Each entry is one small, well-formed piece of context worth
> loading before tackling a task.

${sections}

## API

- [JSON API docs](${SITE}/api)
- [List entries](${SITE}/api/entries): all entries as JSON
- [Single entry](${SITE}/api/entries/{slug}): full Markdown body + rendered HTML
- [Search](${SITE}/api/search?q=...): token-AND substring search
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
