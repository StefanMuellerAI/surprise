import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Search: ${origin}/api/search?q=<query>`,
    `All entries as JSON: ${origin}/api/entries`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${origin}/api/entries/${e.slug}) (${e.kind})${e.summary ? `: ${e.summary}` : ""}`,
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
