import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references.",
    "",
    "agentlore is a small, growing knowledge base written for AI coding agents. " +
      "Each entry is one short, well-formed piece of context worth loading before " +
      "a task. This file is an index; fetch /llms-full.txt for the entire corpus " +
      "concatenated in one request, or use the JSON API for programmatic access.",
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) =>
        `- [${e.title}](${SITE}/e/${e.slug})${e.summary ? `: ${e.summary}` : ""}`,
    ),
    "",
    "## API",
    "",
    `- [JSON API docs](${SITE}/api)`,
    `- [Full corpus as plain text](${SITE}/llms-full.txt)`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
