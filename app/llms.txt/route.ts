import { getAllEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// https://llmstxt.org — a plain-text map of the site for agents.
export function GET() {
  const entries = getAllEntries();
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: short caveats, recipes, idioms, and references worth loading before a task.",
    "",
    `The whole corpus as one Markdown document: ${SITE_URL}/llms-full.txt`,
    `Search: ${SITE_URL}/api/search?q=<query>`,
    "",
    "## Entries",
    "",
    ...entries.map(
      (e) =>
        `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) (${e.kind}${
          e.tags.length ? `; ${e.tags.join(", ")}` : ""
        })${e.summary ? `: ${e.summary}` : ""}`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
