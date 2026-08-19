import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const KIND_LABELS: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER = ["caveat", "recipe", "idiom", "reference", "note"];

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return "";
    const items = inKind
      .map((e) => `- [${e.title}](${base}/e/${e.slug}): ${e.summary}`)
      .join("\n");
    return `## ${KIND_LABELS[kind]}\n\n${items}`;
  }).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — a public knowledge base of caveats,
> recipes, idioms, and references. Each entry is one small, well-formed
> piece of context worth loading before tackling a task.

A full JSON API is documented at ${base}/api. Fetch ${base}/api/entries for
machine-readable metadata on every entry below, or ${base}/api/entries/{slug}
for an entry's full Markdown body and rendered HTML. Content is licensed
CC BY 4.0.

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
