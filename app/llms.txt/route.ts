import { getAllEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

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

function entryLine(e: Entry): string {
  const link = `${SITE_URL}/e/${e.slug}`;
  return e.summary ? `- [${e.title}](${link}): ${e.summary}` : `- [${e.title}](${link})`;
}

export async function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    return `## ${KIND_LABEL[kind]}\n\n${inKind.map(entryLine).join("\n")}`;
  }).filter((s): s is string => s !== null);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before tackling a task.

## API

- [JSON API docs](${SITE_URL}/api): list, fetch, and search entries as JSON (CORS open)
- [All entries](${SITE_URL}/api/entries): full metadata for every entry in this file

${sections.join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
