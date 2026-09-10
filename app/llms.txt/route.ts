import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

// Matches metadataBase in app/layout.tsx. Kept as a constant (rather than
// req.url) because force-static prerenders this route at build time, and
// req.url would then bake in the build machine's localhost origin.
const SITE_URL = "https://agentlore.dev";

const KIND_ORDER: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "Reference",
  note: "Notes",
};

// https://llmstxt.org/ — a plain-text index so agents can load context
// without parsing HTML or discovering the JSON API first.
export async function GET() {
  const origin = SITE_URL;
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Each entry is one small, well-formed piece of context " +
      "worth loading before tackling a task.",
    "",
  ];

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABELS[kind]}`, "");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${origin}/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  lines.push(
    "## API",
    "",
    `- [API reference](${origin}/api): endpoints for listing, fetching, ` +
      "searching, and tagging entries as JSON.",
    `- [All entries as JSON](${origin}/api/entries)`,
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
