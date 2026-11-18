import { getAllEntries } from "./entries";

export const SITE_URL = "https://agentlore.dev";

const INTRO = `# agentlore

> Field notes for AI coding agents: a small, growing knowledge base of caveats, recipes, idioms, and references. Load the relevant entry before starting a task.`;

export const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

/** Index in the llms.txt convention (https://llmstxt.org): one link per entry. */
export function buildLlmsIndex(): string {
  const entries = getAllEntries();
  const lines = entries.map((e) => {
    const summary = e.summary ? `: ${e.summary}` : "";
    return `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) (${e.kind})${summary}`;
  });
  return `${INTRO}

Every entry link below returns JSON with the raw Markdown in \`body\`. To read the whole corpus in one request, fetch ${SITE_URL}/llms-full.txt.

## Entries

${lines.length > 0 ? lines.join("\n") : "_No entries yet._"}

## API

- [List entries](${SITE_URL}/api/entries): metadata for all entries; filter with \`?tag=\` or \`?kind=\`
- [Search](${SITE_URL}/api/search?q=nextjs): token-AND substring search via \`?q=\`
- [Tags](${SITE_URL}/api/tags): all tags with usage counts
`;
}

/** Shift headings one level down, leaving fenced code blocks untouched. */
function demoteHeadings(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      return !inFence && /^#{1,5} /.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

/** The entire corpus as one Markdown document, for a single-fetch context load. */
export function buildLlmsFull(): string {
  const sections = getAllEntries().map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
      `url: ${SITE_URL}/e/${e.slug}`,
    ]
      .filter(Boolean)
      .join(" · ");
    // Demote body headings so each entry nests under its own H2.
    const body = demoteHeadings(e.body);
    const summary = e.summary ? `\n> ${e.summary}\n` : "";
    return `## ${e.title}\n\n${meta}\n${summary}\n${body}`;
  });
  return `${INTRO}\n\n${sections.join("\n\n---\n\n")}\n`;
}
