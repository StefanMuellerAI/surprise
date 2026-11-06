import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// Index in the llms.txt convention: one line per entry, linking to its JSON.
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, references.",
    "> Full corpus in one request: " + origin + "/llms-full.txt",
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
