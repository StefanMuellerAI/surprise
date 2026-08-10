import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `title: ${e.title}`,
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
    ].filter(Boolean);

    return [`# ${e.title}`, "", meta.join("\n"), "", e.body].join("\n");
  });

  const body = [
    "# agentlore — full text",
    "",
    "> Every entry's raw markdown, concatenated for bulk ingestion. See " +
      "/llms.txt for a structured index, or /api/entries for JSON.",
    "",
    "---",
    "",
    sections.join("\n\n---\n\n"),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
