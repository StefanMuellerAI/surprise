import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// https://llmstxt.org/ — an index agents can fetch before browsing further.
export async function GET() {
  const entries = getAllEntries();
  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references worth loading before starting a task.",
    "",
    "Full corpus in one fetch: /llms-full.txt",
    "JSON API: /api/entries, /api/entries/{slug}, /api/search?q=, /api/tags",
    "",
  ];

  for (const [kind, list] of [...byKind.entries()].sort()) {
    lines.push(`## ${kind}`, "");
    for (const e of list) {
      lines.push(`- [${e.title}](/e/${e.slug}): ${e.summary}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
