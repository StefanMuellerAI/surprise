import { getAllEntries } from "@/lib/entries";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

const KIND_LABEL: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
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
  const lines = entries.map((e) => {
    const summary = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE}/e/${e.slug})${summary}`;
  });
  return `## ${KIND_LABEL[kind]}\n\n${lines.join("\n")}\n`;
}

export function GET() {
  const entries = getAllEntries();
  const byKind = KIND_ORDER.map((kind) =>
    section(
      kind,
      entries.filter((e) => e.kind === kind),
    ),
  ).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references. Fetch a single entry's full Markdown at
> ${SITE}/api/entries/{slug}, or list everything at ${SITE}/api/entries.

${byKind.join("\n")}
## API

- [JSON API docs](${SITE}/api)
- [List all entries](${SITE}/api/entries)
- [Search](${SITE}/api/search?q=)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
