import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [];
  lines.push("# agentlore");
  lines.push("");
  lines.push(
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references. Each entry is one small, well-formed piece of context worth loading before a task.",
  );
  lines.push("");
  lines.push(
    `Full corpus as JSON: ${SITE}/api/entries. Single entry as JSON (with rendered HTML): ${SITE}/api/entries/{slug}. Search: ${SITE}/api/search?q=. This file lists every entry as Markdown; fetch each link for the raw content.`,
  );
  lines.push("");
  lines.push("## Entries");
  lines.push("");
  for (const e of entries) {
    const desc = e.summary ? `: ${e.summary}` : "";
    lines.push(`- [${e.title}](${SITE}/e/${e.slug})${desc} (${e.kind})`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
