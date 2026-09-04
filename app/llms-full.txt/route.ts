import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// The whole corpus concatenated into one plain-text document, so an agent
// can load all of agentlore's context with a single fetch instead of one
// request per entry. See /llms.txt for the short, link-based index.
export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      `updated: ${e.updated}`,
      `tags: ${e.tags.length > 0 ? e.tags.join(", ") : "none"}`,
    ];
    if (e.source) meta.push(`source: ${e.source}`);

    return [`# ${e.title}`, "", meta.join("  ·  "), "", e.summary, "", e.body]
      .filter((line) => line !== "")
      .join("\n");
  });

  const text =
    `# agentlore — full corpus\n\n` +
    `${sections.join("\n\n---\n\n")}\n`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
