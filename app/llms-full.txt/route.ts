import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

function entryBlock(e: ReturnType<typeof getAllEntries>[number]): string {
  const lines = [
    `# ${e.title}`,
    "",
    `slug: ${e.slug}`,
    `kind: ${e.kind}`,
    `tags: ${e.tags.join(", ")}`,
    `updated: ${e.updated}`,
    e.source ? `source: ${e.source}` : undefined,
    e.summary ? `summary: ${e.summary}` : undefined,
    "",
    e.body,
  ].filter((l) => l !== undefined);
  return lines.join("\n");
}

export async function GET() {
  const entries = getAllEntries();
  const header = [
    "# agentlore — full corpus",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and",
    "> references. This file concatenates every entry's raw Markdown so an",
    "> agent can load the whole corpus in a single request instead of one",
    "> per entry. Individual entries: https://agentlore.dev/api/entries",
    "",
    `entries: ${entries.length}`,
  ].join("\n");

  const body = [header, ...entries.map(entryBlock)].join(
    "\n\n---\n\n",
  );

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
