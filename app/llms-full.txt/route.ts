import { getAllEntries } from "@/lib/entries";

const BASE = "https://agentlore.dev";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections: string[] = [
    "# agentlore — full content",
    "",
    "> Field notes for AI coding agents. All entries with complete body text.",
    "> Load this file to give an agent the full knowledge base as context.",
    "",
    `Source: ${BASE}  |  Index: ${BASE}/llms.txt  |  JSON API: ${BASE}/api/entries`,
    "",
    "---",
    "",
  ];

  for (const e of entries) {
    const meta = [
      `kind: ${e.kind}`,
      `updated: ${e.updated}`,
      ...(e.tags.length > 0 ? [`tags: ${e.tags.join(", ")}`] : []),
      ...(e.source ? [`source: ${e.source}`] : []),
    ].join("  |  ");

    sections.push(`# ${e.title}`);
    sections.push("");
    sections.push(meta);
    if (e.summary) {
      sections.push("");
      sections.push(`> ${e.summary}`);
    }
    sections.push("");
    sections.push(e.body);
    sections.push("");
    sections.push(`URL: ${BASE}/e/${e.slug}`);
    if (e.related.length > 0) {
      sections.push(`Related: ${e.related.map((r) => `${BASE}/e/${r}`).join(", ")}`);
    }
    sections.push("");
    sections.push("---");
    sections.push("");
  }

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
