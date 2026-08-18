import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const body = [
    "# agentlore — full corpus",
    "",
    "> Every entry in one file, for agents that want to load the whole " +
      `knowledge base in a single request. Index: ${SITE}/llms.txt`,
    "",
    "---",
    "",
    ...entries.map((e) => {
      const meta = [
        `slug: ${e.slug} · kind: ${e.kind} · updated: ${e.updated}` +
          (e.tags.length ? ` · tags: ${e.tags.join(", ")}` : ""),
      ];
      if (e.source) meta.push(`source: ${e.source}`);
      return [`## ${e.title}`, "", ...meta, "", e.body, "", "---"].join("\n");
    }),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
