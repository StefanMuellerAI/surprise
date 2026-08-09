import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      `url: ${SITE}/e/${e.slug}`,
    ];
    if (e.source) meta.push(`source: ${e.source}`);

    return [`# ${e.title}`, "", meta.join(" · "), "", e.body].join("\n");
  });

  const header = [
    "# agentlore — full corpus",
    "",
    "> Every entry's raw Markdown, concatenated for single-request ingestion.",
    `> Structured metadata and per-entry HTML: ${SITE}/api`,
    "",
    "---",
    "",
  ].join("\n");

  const body = header + sections.join("\n\n---\n\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
