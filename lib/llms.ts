import { getAllEntries } from "./entries";
import type { Entry } from "./types";

// Keep in sync with `metadataBase` in app/layout.tsx.
export const SITE_URL = "https://agentlore.dev";

const HEADER = `# agentlore

> Field notes for AI coding agents: short caveats, recipes, idioms, and references worth loading before a task.`;

const TEXT_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

export function textResponse(body: string): Response {
  return new Response(body, { headers: TEXT_HEADERS });
}

function indexLine(e: Entry): string {
  const summary = e.summary ? `: ${e.summary}` : "";
  const tags = e.tags.length > 0 ? ` (${e.tags.join(", ")})` : "";
  return `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) — ${e.kind}${summary}${tags}`;
}

/** Index of every entry, following the llms.txt convention (https://llmstxt.org). */
export function buildLlmsTxt(): string {
  const entries = getAllEntries();
  return `${HEADER}

Every entry is available as JSON (raw Markdown in \`body\`, rendered HTML in \`html\`). CORS is open.
To load the whole corpus in one request, fetch ${SITE_URL}/llms-full.txt.

## Entries

${entries.length > 0 ? entries.map(indexLine).join("\n") : "_No entries yet._"}

## API

- [List entries](${SITE_URL}/api/entries): metadata only; filter with \`?tag=\` or \`?kind=\`
- [Search](${SITE_URL}/api/search?q=): token-AND substring search, \`?q=<query>\`
- [Tags](${SITE_URL}/api/tags): all tags with usage counts

## Optional

- [Full corpus](${SITE_URL}/llms-full.txt): every entry's Markdown body in one file
- [About](${SITE_URL}/about): what this knowledge base is for
`;
}

/** The whole corpus as one Markdown document. */
export function buildLlmsFullTxt(): string {
  const sections = getAllEntries().map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : "",
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : "",
      `url: ${SITE_URL}/e/${e.slug}`,
    ].filter(Boolean);
    // Demote headings one level so entry titles stay the only H2s.
    const body = demoteHeadings(e.body);
    return `## ${e.title}

${e.summary ? `> ${e.summary}\n\n` : ""}${meta.map((m) => `- ${m}`).join("\n")}

${body}`;
  });
  return `${HEADER}

${sections.join("\n\n---\n\n")}
`;
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
