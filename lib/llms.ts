import { getAllEntries } from "./entries";

export const SITE_URL = "https://agentlore.dev";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

export function markdownResponse(body: string): Response {
  return new Response(body, { headers: HEADERS });
}

const INTRO = `# agentlore

> Field notes for AI coding agents: caveats, recipes, idioms, and references. Each entry is one small piece of pre-flight context worth loading before a task.`;

/** Index following the llms.txt convention (https://llmstxt.org). */
export function buildLlmsIndex(): string {
  const entries = getAllEntries();
  const list = entries
    .map((e) => {
      const summary = e.summary ? `: ${e.summary}` : "";
      return `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) (${e.kind})${summary}`;
    })
    .join("\n");

  return `${INTRO}

The whole corpus in a single Markdown document: ${SITE_URL}/llms-full.txt

## Entries

${list || "No entries yet."}

## API

- [List entries](${SITE_URL}/api/entries): metadata only, supports \`?tag=\` and \`?kind=\`
- [Search](${SITE_URL}/api/search?q=): token-AND substring search, \`?q=...\`
- [Tags](${SITE_URL}/api/tags): tags with usage counts
`;
}

/** Push body headings one level down so they nest under the entry title. */
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

/** Every entry, full body, concatenated: one fetch loads the corpus. */
export function buildLlmsFull(): string {
  const sections = getAllEntries().map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : "",
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : "",
      `url: ${SITE_URL}/e/${e.slug}`,
    ]
      .filter(Boolean)
      .join(" | ");
    const summary = e.summary ? `\n\n> ${e.summary}` : "";
    return `## ${e.title}\n\n${meta}${summary}\n\n${demoteHeadings(e.body)}`;
  });

  return `${INTRO}\n\n${sections.join("\n\n---\n\n")}\n`;
}
