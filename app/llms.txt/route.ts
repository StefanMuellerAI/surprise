import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const KIND_LABEL: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};
const KIND_ORDER = ["caveat", "recipe", "idiom", "reference", "note"];

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const byKind = new Map<string, typeof entries>();
  for (const kind of KIND_ORDER) byKind.set(kind, []);
  for (const e of entries) byKind.get(e.kind)?.push(e);

  const sections = KIND_ORDER.filter((k) => (byKind.get(k)?.length ?? 0) > 0)
    .map((kind) => {
      const lines = byKind
        .get(kind)!
        .map((e) => `- [${e.title}](${base}/e/${e.slug}): ${e.summary}`)
        .join("\n");
      return `## ${KIND_LABEL[kind]}\n\n${lines}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references worth loading before tackling a task.

Full plain-text corpus (all entry bodies inlined): ${base}/llms-full.txt
JSON API: ${base}/api/entries — see ${base}/api for docs.

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
