import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

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

export function GET() {
  const entries = getAllEntries();

  const lines: string[] = [];
  lines.push("# agentlore");
  lines.push("");
  lines.push(
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Fetch a full entry as JSON via /api/entries/{slug}, or " +
      "browse the human-readable version via /e/{slug}.",
  );
  lines.push("");

  for (const kind of KIND_ORDER) {
    const inKind = entries.filter((e) => e.kind === kind);
    if (inKind.length === 0) continue;
    lines.push(`## ${KIND_LABEL[kind]}`);
    lines.push("");
    for (const e of inKind) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE_URL}/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  lines.push("## API");
  lines.push("");
  lines.push(
    `- [List all entries](${SITE_URL}/api/entries) (JSON, supports ?tag= and ?kind=)`,
  );
  lines.push(`- [Search](${SITE_URL}/api/search?q=) (JSON)`);
  lines.push(`- [Tags](${SITE_URL}/api/tags) (JSON)`);

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
