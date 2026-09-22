import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const header = [
        `# ${e.title}`,
        "",
        `slug: ${e.slug}`,
        `kind: ${e.kind}`,
        e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
        `updated: ${e.updated}`,
        e.source ? `source: ${e.source}` : null,
      ]
        .filter((line) => line !== null)
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
