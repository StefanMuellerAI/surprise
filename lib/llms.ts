import { getAllEntries } from "./entries";

const SITE = "https://agentlore.dev";

const HEADER = `# agentlore

> Field notes for AI coding agents: short caveats, recipes, idioms, and references worth loading before a task.
`;

/** Index of every entry, following the llms.txt convention (https://llmstxt.org). */
export function llmsIndex(): string {
  const lines = getAllEntries().map(
    (e) =>
      `- [${e.title}](${SITE}/api/entries/${e.slug}) (${e.kind}; ${e.tags.join(", ") || "untagged"}): ${e.summary}`,
  );
  return `${HEADER}
The whole corpus as one plain-text file: ${SITE}/llms-full.txt

## Entries

${lines.join("\n") || "No entries yet."}

## API

- [List entries](${SITE}/api/entries): metadata only; filter with \`?tag=\` or \`?kind=\`
- [Search](${SITE}/api/search?q=): token-AND substring search via \`?q=\`
- [Tags](${SITE}/api/tags): tags with usage counts
`;
}

/** Every entry's full Markdown body in a single document. */
export function llmsFull(): string {
  const sections = getAllEntries().map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ") || "none"}`,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
      `url: ${SITE}/e/${e.slug}`,
    ]
      .filter(Boolean)
      .join(" | ");
    return `## ${e.title}\n\n${meta}\n\n${e.summary ? `> ${e.summary}\n\n` : ""}${e.body}`;
  });
  return `${HEADER}\n${sections.join("\n\n---\n\n") || "No entries yet."}\n`;
}

export const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};
