import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER: EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

function section(kind: EntryKind, entries: Entry[]): string {
  if (entries.length === 0) return "";
  const items = entries
    .map((e) => {
      const desc = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${SITE}/e/${e.slug})${desc}`;
    })
    .join("\n");
  return `## ${KIND_LABEL[kind]}\n\n${items}\n`;
}

export function GET() {
  const entries = getAllEntries();
  const byKind = new Map<EntryKind, Entry[]>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const sections = KIND_ORDER.map((kind) =>
    section(kind, byKind.get(kind) ?? []),
  ).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references worth loading before a task. Full JSON API at ${SITE}/api.

${sections.join("\n")}
## Machine-readable

- [JSON entry list](${SITE}/api/entries)
- [JSON entry detail](${SITE}/api/entries/{slug})
- [Search API](${SITE}/api/search?q=)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
