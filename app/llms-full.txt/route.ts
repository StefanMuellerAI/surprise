import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      `url: ${SITE}/e/${e.slug}`,
    ].join("\n");
    return `# ${e.title}\n\n${meta}\n\n${e.body}`;
  });

  const body =
    `# agentlore — full text\n\n> Every entry in this knowledge base, concatenated for single-fetch ingestion. See ${SITE}/llms.txt for a linked index.\n\n` +
    sections.join("\n\n---\n\n") +
    "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
