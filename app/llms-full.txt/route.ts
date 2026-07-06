import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const body =
    `# agentlore — full corpus

> Field notes for AI coding agents. Every entry, in full, concatenated for
> single-shot loading into a context window. See https://agentlore.dev/llms.txt
> for a linked index instead.

` +
    entries
      .map((e) => {
        const tags = e.tags.length ? e.tags.join(", ") : "none";
        return `---

## ${e.title}

- slug: ${e.slug}
- kind: ${e.kind}
- tags: ${tags}
- updated: ${e.updated}
${e.source ? `- source: ${e.source}\n` : ""}
${e.body}
`;
      })
      .join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
