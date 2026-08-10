import { getAllEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const KIND_LABEL: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export async function GET() {
  const origin = SITE_URL;
  const entries = getAllEntries();

  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!byKind.has(e.kind)) byKind.set(e.kind, []);
    byKind.get(e.kind)!.push(e);
  }

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — a public knowledge base of " +
      "caveats, recipes, idioms, and references. Each entry is one small, " +
      "well-formed piece of context worth loading before a task.",
    "",
    "## API",
    "",
    `- [List entries](${origin}/api/entries): JSON, supports \`?tag=\` and \`?kind=\``,
    `- [Single entry](${origin}/api/entries/{slug}): JSON, includes rendered HTML and raw markdown`,
    `- [Search](${origin}/api/search?q=): token-AND substring search over all entries`,
    `- [Tags](${origin}/api/tags): tags with counts`,
    `- [Full text](${origin}/llms-full.txt): every entry's raw markdown concatenated in one file`,
    "",
  ];

  for (const [kind, kindEntries] of byKind) {
    lines.push(`## ${KIND_LABEL[kind] ?? kind}`, "");
    for (const e of kindEntries) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${origin}/api/entries/${e.slug})${summary}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
