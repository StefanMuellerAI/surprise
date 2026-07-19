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
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${SITE}/e/${e.slug})${summary}`;
    })
    .join("\n");
  return `## ${KIND_LABEL[kind]}\n\n${items}\n`;
}

export async function GET() {
  const entries = getAllEntries();
  const sections = KIND_ORDER.map((kind) =>
    section(
      kind,
      entries.filter((e) => e.kind === kind),
    ),
  ).filter(Boolean);

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and
> references. Each entry is one small, well-formed piece of context worth
> loading before tackling a task.

Full corpus as JSON: ${SITE}/api/entries · single entry: ${SITE}/api/entries/{slug} · search: ${SITE}/api/search?q=

${sections.join("\n")}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
