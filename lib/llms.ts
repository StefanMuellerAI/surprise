import { getAllEntries } from "./entries";
import type { Entry } from "./types";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentlore.dev"
).replace(/\/$/, "");

const INTRO = `# agentlore

> Field notes for AI coding agents: short caveats, recipes, idioms, and references worth loading before a task.`;

export const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

function entryLine(e: Entry): string {
  const summary = e.summary ? `: ${e.summary}` : "";
  return `- [${e.title}](${SITE_URL}/api/entries/${e.slug}) (${e.kind})${summary}`;
}

/** Index of the corpus in the llms.txt convention (https://llmstxt.org). */
export function buildLlmsTxt(): string {
  const entries = getAllEntries();
  return [
    INTRO,
    "",
    `Every entry link below returns JSON with the raw Markdown in \`body\`. The whole corpus in one plain-text file: ${SITE_URL}/llms-full.txt`,
    "",
    "## Entries",
    "",
    ...(entries.length > 0 ? entries.map(entryLine) : ["_No entries yet._"]),
    "",
    "## API",
    "",
    `- [List entries](${SITE_URL}/api/entries): metadata for all entries; filter with \`?tag=\` or \`?kind=\``,
    `- [Search](${SITE_URL}/api/search?q=): token-AND substring search across title, summary, tags, body`,
    `- [Tags](${SITE_URL}/api/tags): all tags with usage counts`,
    "",
  ].join("\n");
}

/** Push headings one level down so each entry nests under its own H2. */
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

/** The entire corpus as one Markdown document — one fetch, no parsing. */
export function buildLlmsFullTxt(): string {
  const entries = getAllEntries();
  const sections = entries.map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
      `url: ${SITE_URL}/e/${e.slug}`,
    ]
      .filter(Boolean)
      .join(" · ");
    const body = demoteHeadings(e.body);
    return [`## ${e.title}`, "", meta, "", e.summary, "", body]
      .filter((part, i, arr) => !(part === "" && arr[i - 1] === ""))
      .join("\n");
  });
  return [INTRO, "", ...sections.flatMap((s) => [s, "", "---", ""])]
    .join("\n")
    .replace(/\n---\n\s*$/, "");
}
