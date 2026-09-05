import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

// llms.txt convention (https://llmstxt.org/): a plain-text index an agent
// can fetch in one request instead of crawling and parsing HTML pages.
export async function GET() {
  const entries = getAllEntries();
  const byKind = new Map<EntryKind, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Fetch any entry as JSON via GET /api/entries/{slug}, or " +
      "read the linked pages directly.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const kindEntries = byKind.get(kind);
    if (!kindEntries || kindEntries.length === 0) continue;
    lines.push(`## ${kind}s`);
    for (const e of kindEntries) {
      lines.push(
        `- [${e.title}](${BASE_URL}/e/${e.slug})${e.summary ? `: ${e.summary}` : ""}`,
      );
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push(`- [List all entries](${BASE_URL}/api/entries)`);
  lines.push(`- [Search entries](${BASE_URL}/api/search?q=)`);
  lines.push(`- [Tags with counts](${BASE_URL}/api/tags)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
