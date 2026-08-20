import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return [`# ${e.title}`, "", meta, "", e.body].join("\n");
  });

  const body =
    "# agentlore — full corpus\n\n" +
    "> Every entry concatenated for a single-fetch load. See /llms.txt for an " +
    "index, or the JSON API for structured access.\n\n" +
    sections.join("\n\n---\n\n") +
    "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
