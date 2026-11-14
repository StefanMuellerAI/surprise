import { getAllEntries } from "./entries";

export const SITE_URL = "https://agentlore.dev";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

export function textResponse(body: string): Response {
  return new Response(body, { headers: HEADERS });
}

/** Index following the llms.txt convention (https://llmstxt.org). */
export function buildLlmsIndex(): string {
  const entries = getAllEntries();
  const lines = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents: caveats, recipes, idioms, and references — small pieces of pre-flight context worth loading before a task.",
    "",
    `The whole corpus as one Markdown document: ${SITE_URL}/llms-full.txt`,
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
    "## API",
    "",
    `- [List entries](${SITE_URL}/api/entries): metadata only, supports \`?tag=\` and \`?kind=\``,
    `- [Search](${SITE_URL}/api/search?q=): token-AND substring search`,
    `- [Tags](${SITE_URL}/api/tags): tags with counts`,
    "",
  ];
  return lines.join("\n");
}

/** Every entry, in full, as a single Markdown document. */
export function buildLlmsFull(): string {
  const entries = getAllEntries();
  const parts = [
    "# agentlore — full corpus",
    "",
    `> ${entries.length} field notes for AI coding agents. Index: ${SITE_URL}/llms.txt`,
  ];
  for (const e of entries) {
    parts.push(
      "",
      "---",
      "",
      `# ${e.title}`,
      "",
      [
        `kind: ${e.kind}`,
        e.tags.length ? `tags: ${e.tags.join(", ")}` : "",
        `updated: ${e.updated}`,
        `url: ${SITE_URL}/e/${e.slug}`,
        e.source ? `source: ${e.source}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      "",
    );
    if (e.summary) parts.push(`> ${e.summary}`, "");
    parts.push(e.body);
  }
  parts.push("");
  return parts.join("\n");
}
