import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();
  const generated = new Date().toISOString().slice(0, 10);

  const sections = entries.map((e) => {
    const tagLine = e.tags.length > 0 ? `Tags: ${e.tags.join(", ")} · ` : "";
    const sourceLine = e.source ? `\nSource: ${e.source}` : "";
    return [
      `## [${e.kind}] ${e.title}`,
      `> ${e.summary}`,
      ``,
      `${tagLine}Updated: ${e.updated}${sourceLine}`,
      ``,
      e.body,
    ].join("\n");
  });

  const digest = [
    `# agentlore digest`,
    `Generated: ${generated} · ${entries.length} entr${entries.length === 1 ? "y" : "ies"}`,
    ``,
    `This document contains the full agentlore knowledge base. Load it as`,
    `context before tackling coding tasks to avoid known pitfalls.`,
    ``,
    `---`,
    ``,
    sections.join("\n\n---\n\n"),
    ``,
    `---`,
    ``,
    `*End of agentlore digest.*`,
  ].join("\n");

  return new Response(digest, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
