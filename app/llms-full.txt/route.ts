import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export async function GET() {
  const entries = getAllEntries();

  const body = `# agentlore — full corpus

> Field notes for AI coding agents. Every entry below, in full, in one
> fetch. Index with links: ${SITE}/llms.txt

${entries
  .map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      `slug: ${e.slug}`,
      e.tags.length > 0 ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return `---

# ${e.title}

${meta}

${e.summary}

${e.body}`;
  })
  .join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
