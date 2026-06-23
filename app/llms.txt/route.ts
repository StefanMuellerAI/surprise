import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const BASE = "https://agentlore.dev";

const KIND_ORDER: EntryKind[] = ["caveat", "recipe", "idiom", "reference", "note"];

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const byKind = new Map<EntryKind, typeof entries>();
  for (const kind of KIND_ORDER) byKind.set(kind, []);
  for (const e of entries) byKind.get(e.kind)?.push(e);

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references to load as pre-flight context before a task.",
    "",
    `Full content with body text: ${BASE}/llms-full.txt`,
    `JSON API: ${BASE}/api/entries`,
    "",
  ];

  for (const kind of KIND_ORDER) {
    const group = byKind.get(kind) ?? [];
    if (group.length === 0) continue;
    lines.push(`## ${kind[0].toUpperCase()}${kind.slice(1)}s`);
    lines.push("");
    for (const e of group) {
      const desc = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${BASE}/e/${e.slug})${desc}`);
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push("");
  lines.push(`- [All entries](${BASE}/api/entries): JSON metadata for every entry`);
  lines.push(`- [Search](${BASE}/api/search?q=QUERY): Full-text search, returns ranked results`);
  lines.push(`- [Tags](${BASE}/api/tags): All tags with usage counts`);
  lines.push(`- [Full content](${BASE}/llms-full.txt): Plain-text dump of all entries including body`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
