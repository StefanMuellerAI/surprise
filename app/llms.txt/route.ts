import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const entries = getAllEntries();

  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and references. Small, well-formed pieces of context worth loading before a task.",
    "",
    `Full corpus, one file: ${origin}/llms-full.txt`,
    `JSON API: ${origin}/api`,
    "",
    "## Entries",
    "",
    ...entries.map((e) => {
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${origin}/e/${e.slug})${summary}`;
    }),
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
