import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references.",
    "",
    `Full JSON API: ${origin}/api. Each entry is also available as JSON at ${origin}/api/entries/{slug}.`,
    "",
    "## Entries",
    "",
    ...getAllEntries().map(
      (e) =>
        `- [${e.title}](${origin}/api/entries/${e.slug})` +
        (e.summary ? `: ${e.summary}` : "") +
        ` (${e.kind})`,
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
