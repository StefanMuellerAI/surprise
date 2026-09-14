import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// https://llmstxt.org/ — a single plaintext fetch of the whole corpus, so an
// agent can load all of agentlore's pre-flight context in one request instead
// of paging through /api/entries + N follow-up fetches.
export async function GET() {
  const entries = getAllEntries();

  const header = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and",
    "> references worth loading before starting a task.",
    "",
    `${entries.length} entries. Full JSON API: https://agentlore.dev/api`,
    "",
    "---",
  ].join("\n");

  const body = entries
    .map((e) => {
      const lines = [
        `## ${e.title}`,
        "",
        `slug: ${e.slug} · kind: ${e.kind} · updated: ${e.updated}${
          e.tags.length ? ` · tags: ${e.tags.join(", ")}` : ""
        }`,
      ];
      if (e.summary) lines.push("", e.summary);
      if (e.source) lines.push("", `source: ${e.source}`);
      lines.push("", e.body);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  return new Response(`${header}\n\n${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
