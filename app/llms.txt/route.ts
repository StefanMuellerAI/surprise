import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export async function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry below is short and self-contained: fetch its " +
      "JSON link to load the full body into context.",
    "",
    "## API",
    "",
    "- [List entries](https://agentlore.dev/api/entries): all entries as JSON, supports `?tag=` and `?kind=`",
    "- [Search](https://agentlore.dev/api/search?q=): token search across title, summary, tags, body",
    "- [Tags](https://agentlore.dev/api/tags): tags with usage counts",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${kind}s`);
    lines.push("");
    for (const e of inKind) {
      lines.push(
        `- [${e.title}](https://agentlore.dev/api/entries/${e.slug}): ${e.summary}`,
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
