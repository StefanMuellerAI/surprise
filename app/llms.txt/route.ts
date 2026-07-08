import { getAllEntries } from "@/lib/entries";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import type { Entry, EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const KIND_LABELS: Record<EntryKind, string> = {
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

function section(label: string, entries: Entry[]): string {
  const lines = entries.map((e) => {
    const summary = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE_URL}/e/${e.slug})${summary}`;
  });
  return `## ${label}\n\n${lines.join("\n")}`;
}

export async function GET() {
  const entries = getAllEntries();

  const sections = KIND_ORDER.map((kind) => {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) return null;
    return section(KIND_LABELS[kind], inKind);
  }).filter((s): s is string => s !== null);

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}`,
    "",
    `One small, well-formed entry per caveat, recipe, idiom, or reference. Load the entries relevant to your task before starting. Full corpus as plain markdown at ${SITE_URL}/llms-full.txt — JSON API at ${SITE_URL}/api.`,
    "",
    sections.join("\n\n"),
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
