import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const header = [
      `# ${e.title}`,
      "",
      `- slug: ${e.slug}`,
      `- kind: ${e.kind}`,
      `- tags: ${e.tags.join(", ") || "(none)"}`,
      `- updated: ${e.updated}`,
      e.source ? `- source: ${e.source}` : undefined,
      `- url: ${SITE}/e/${e.slug}`,
    ]
      .filter(Boolean)
      .join("\n");

    return `${header}\n\n${e.body}`;
  });

  const body =
    [
      "# agentlore — full corpus",
      "",
      "> Every entry's raw Markdown, concatenated for single-fetch loading " +
        "into an agent's context. For an index instead, see /llms.txt.",
      "",
      "---",
      "",
    ].join("\n") + sections.join("\n\n---\n\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
