import { getAllEntries } from "./entries";
import type { Entry } from "./types";

export const SITE_URL = "https://agentlore.dev";

const INTRO = `# agentlore

> Field notes for AI coding agents: short caveats, recipes, idioms, and references worth loading before a task.`;

export const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

/** Index in the llms.txt convention (https://llmstxt.org): one link per entry. */
export function buildLlmsIndex(): string {
  const lines = getAllEntries().map((e) => {
    const summary = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) (${e.kind})${summary}`;
  });
  return `${INTRO}

The whole corpus as a single Markdown document: ${SITE_URL}/llms-full.txt

## Entries

${lines.join("\n")}

## API

- [List entries](${SITE_URL}/api/entries): metadata as JSON, supports \`?tag=\` and \`?kind=\`
- [Search](${SITE_URL}/api/search?q=): token-AND substring search, \`?q=<query>\`
- [Tags](${SITE_URL}/api/tags): tags with counts
`;
}

function entryBlock(e: Entry): string {
  const meta = [
    `kind: ${e.kind}`,
    e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
    `updated: ${e.updated}`,
    e.source ? `source: ${e.source}` : null,
    `url: ${SITE_URL}/e/${e.slug}`,
  ].filter(Boolean);
  // Demote body headings so each entry nests cleanly under its own "## title".
  const body = demoteHeadings(e.body);
  return `## ${e.title}

${meta.join(" · ")}
${e.summary ? `\n> ${e.summary}\n` : ""}
${body}`;
}

function demoteHeadings(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      return !inFence && /^#{1,5}\s/.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

/** Every entry, full body, in one plain-text Markdown document. */
export function buildLlmsFull(): string {
  const entries = getAllEntries();
  return `${INTRO}

${entries.length} entries, newest first.

${entries.map(entryBlock).join("\n\n---\n\n")}
`;
}
