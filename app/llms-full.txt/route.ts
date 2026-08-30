import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const body = entries
    .map((e) => {
      const header = [
        `# ${e.title}`,
        "",
        `kind: ${e.kind}`,
        `slug: ${e.slug}`,
        `url: ${base}/e/${e.slug}`,
        `tags: ${e.tags.join(", ")}`,
        `updated: ${e.updated}`,
        e.source ? `source: ${e.source}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      return `${header}\n\n${e.body}`;
    })
    .join("\n\n---\n\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
