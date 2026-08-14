import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const meta = [
        `slug: ${e.slug}`,
        `kind: ${e.kind}`,
        `tags: ${e.tags.join(", ") || "—"}`,
        `updated: ${e.updated}`,
        e.source ? `source: ${e.source}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      return `# ${e.title}\n\n${meta}\n\n${e.summary}\n\n${e.body}`;
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
