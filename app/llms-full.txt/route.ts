import { getAllEntries } from "@/lib/entries";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const chunks = entries.map((e) => {
    const meta = [
      `# ${e.title}`,
      "",
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      `url: ${SITE_URL}/e/${e.slug}`,
    ].join("\n");
    return `${meta}\n\n${e.body}`;
  });

  const body = [
    `# ${SITE_NAME} — full corpus`,
    "",
    `> ${SITE_TAGLINE}`,
    `> ${entries.length} entries, generated for bulk LLM ingestion. Index at ${SITE_URL}/llms.txt`,
    "",
    chunks.join("\n\n---\n\n"),
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
