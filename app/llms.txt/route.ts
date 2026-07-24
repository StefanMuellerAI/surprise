import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABELS: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

export function GET() {
  const entries = getAllEntries();
  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and",
    "> references. Each entry is one small, well-formed piece of context.",
    "",
    "## API",
    "",
    `- [List entries](${SITE}/api/entries): JSON, supports \`?tag=\` and \`?kind=\``,
    `- [Get one entry](${SITE}/api/entries/{slug}): JSON with rendered HTML + raw markdown`,
    `- [Search](${SITE}/api/search?q=...): token-AND substring search`,
    `- [Tags](${SITE}/api/tags): tags with counts`,
    "",
  ];

  for (const [kind, list] of byKind) {
    lines.push(`## ${KIND_LABELS[kind] ?? kind}`, "");
    for (const e of list) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/e/${e.slug})${summary}`);
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
