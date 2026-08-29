import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const meta = [
        `kind: ${e.kind}`,
        `slug: ${e.slug}`,
        `updated: ${e.updated}`,
      ];
      if (e.tags.length > 0) meta.push(`tags: ${e.tags.join(", ")}`);
      if (e.source) meta.push(`source: ${e.source}`);
      return [`# ${e.title}`, meta.join(" · "), e.summary, e.body]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n---\n\n");

  const text = [
    "# agentlore",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references, as a single plain-text fetch. Structured JSON is also " +
      "available: GET /api/entries (list) and GET /api/entries/{slug} " +
      "(single entry, with rendered HTML).",
    `${entries.length} ${entries.length === 1 ? "entry" : "entries"}.`,
    body,
  ]
    .filter(Boolean)
    .join("\n\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
