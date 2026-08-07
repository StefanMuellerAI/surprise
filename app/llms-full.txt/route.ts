import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [];
  lines.push("# agentlore — full text");
  lines.push("");
  lines.push(
    "> Every agentlore entry, concatenated as Markdown, for agents that want the whole corpus in one fetch.",
  );
  lines.push("");
  lines.push(`Index with summaries: ${SITE}/llms.txt`);

  for (const e of entries) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(`# ${e.title}`);
    lines.push("");
    lines.push(`- slug: ${e.slug}`);
    lines.push(`- kind: ${e.kind}`);
    if (e.tags.length > 0) lines.push(`- tags: ${e.tags.join(", ")}`);
    lines.push(`- updated: ${e.updated}`);
    if (e.source) lines.push(`- source: ${e.source}`);
    lines.push(`- url: ${SITE}/e/${e.slug}`);
    lines.push("");
    lines.push(e.body);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
