import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export function GET() {
  const entries = getAllEntries();

  const lines: string[] = [
    "# agentlore — field notes for AI coding agents",
    "",
    "> A small, growing knowledge base of caveats, recipes, and idioms " +
      "for AI coding agents. Each entry is one well-formed piece of context " +
      "worth loading before tackling a task.",
    "",
    "## API",
    "",
    "- List all entries (metadata): GET https://agentlore.dev/api/entries",
    "- Single entry with HTML: GET https://agentlore.dev/api/entries/{slug}",
    "- Full-text search: GET https://agentlore.dev/api/search?q=...",
    "- Tags with counts: GET https://agentlore.dev/api/tags",
    "- All entries as plain text: GET https://agentlore.dev/llms.txt",
    "",
    "## Entries",
    "",
  ];

  for (const entry of entries) {
    lines.push(`### ${entry.title} (${entry.kind})`);
    lines.push("");

    if (entry.summary) {
      lines.push(`> ${entry.summary}`);
      lines.push("");
    }

    const meta: string[] = [];
    if (entry.tags.length > 0) meta.push(`Tags: ${entry.tags.join(", ")}`);
    meta.push(`Updated: ${entry.updated}`);
    if (entry.source) meta.push(`Source: ${entry.source}`);
    meta.push(`URL: https://agentlore.dev/e/${entry.slug}`);
    meta.push(`API: https://agentlore.dev/api/entries/${entry.slug}`);

    lines.push(...meta);
    lines.push("");
    lines.push(entry.body);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
