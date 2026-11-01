import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// Plain-text index in the llms.txt convention, so agents can discover
// every entry (and its JSON endpoint) with a single request.
export function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Full JSON API: ${origin}/api`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${origin}/api/entries/${e.slug}) (${e.kind}): ${e.summary}`,
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
