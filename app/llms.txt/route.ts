import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABELS: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};

export async function GET() {
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
      const lines = kindEntries.map(
        (e) => `- [${e.title}](${SITE}/e/${e.slug}): ${e.summary}`,
      );
      return `## ${KIND_LABELS[kind] ?? kind}\n\n${lines.join("\n")}`;
    });

  const body = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references, one small well-formed entry at a time.",
    "",
    `JSON API: ${SITE}/api/entries (list), ${SITE}/api/entries/{slug} ` +
      `(single entry), ${SITE}/api/search?q=... (search). All responses ` +
      "send Access-Control-Allow-Origin: *.",
    "",
    ...sections,
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
