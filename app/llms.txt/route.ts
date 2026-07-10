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
  for (const kind of KIND_ORDER) byKind.set(kind, []);
  for (const e of entries) {
    if (!byKind.has(e.kind)) byKind.set(e.kind, []);
    byKind.get(e.kind)!.push(e);
  }

  const sections = [...byKind.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([kind, list]) => {
      const lines = list.map((e) => {
        const tags = e.tags.length ? ` (${e.tags.join(", ")})` : "";
        const summary = e.summary ? `: ${e.summary}${tags}` : tags;
        return `- [${e.title}](${SITE}/e/${e.slug})${summary}`;
      });
      return `## ${KIND_LABEL[kind] ?? kind}\n\n${lines.join("\n")}`;
    });

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. See the JSON API below for machine-readable access to " +
      "each entry's raw markdown body.",
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## API",
    "",
    `- [List entries](${SITE}/api/entries): JSON, supports ?tag= and ?kind=`,
    `- [Single entry](${SITE}/api/entries/{slug}): JSON with rendered HTML and raw markdown body`,
    `- [Search](${SITE}/api/search?q=...): token-AND substring search`,
    `- [Tags](${SITE}/api/tags): tags with counts`,
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
