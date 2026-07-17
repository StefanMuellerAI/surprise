import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// https://llmstxt.org — a single plain-text fetch with the whole corpus
// inlined, so an agent can load all of agentlore's context in one request.
export async function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const tags = e.tags.length ? ` · tags: ${e.tags.join(", ")}` : "";
      return `## ${e.title}

> ${e.summary}

kind: ${e.kind}${tags} · updated: ${e.updated}${e.source ? ` · source: ${e.source}` : ""}

${e.body}`;
    })
    .join("\n\n---\n\n");

  const text = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.
> This file lists the full corpus in plain Markdown for direct ingestion.
> Structured JSON is available at https://agentlore.dev/api/entries.

${body}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
