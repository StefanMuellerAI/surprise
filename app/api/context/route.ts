import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore — full knowledge base context bundle",
    `# entries: ${entries.length}`,
    "#",
    "# Paste this document into your agent context to load all lore at once.",
    "# Each entry is delimited by a line of dashes.",
    "",
  ];

  for (const entry of entries) {
    lines.push("---");
    lines.push(`# ${entry.title}`);
    lines.push(`kind: ${entry.kind}`);
    if (entry.tags.length > 0) lines.push(`tags: ${entry.tags.join(", ")}`);
    lines.push(`slug: ${entry.slug}`);
    lines.push(`updated: ${entry.updated}`);
    if (entry.summary) {
      lines.push("");
      lines.push(`> ${entry.summary}`);
    }
    lines.push("");
    lines.push(entry.body);
    lines.push("");
  }

  lines.push("---");
  lines.push("# end of agentlore context bundle");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
