import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `JSON API: ${origin}/api/entries (filter with ?tag= or ?kind=), ${origin}/api/search?q=`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${origin}/api/entries/${e.slug}) (${e.kind})${
          e.summary ? `: ${e.summary}` : ""
        }`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
