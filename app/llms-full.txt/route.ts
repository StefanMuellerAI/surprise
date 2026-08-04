import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export function GET() {
  const entries = [...getAllEntries()].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const parts = entries.map((e) => {
    const meta = `kind: ${e.kind} · tags: ${e.tags.join(", ") || "none"} · updated: ${e.updated} · source: ${SITE}/e/${e.slug}${e.source ? ` · authoritative: ${e.source}` : ""}`;
    return `# ${e.title}\n\n> ${e.summary}\n\n${meta}\n\n${e.body}`;
  });

  const body = `# agentlore — full corpus

> Every entry in this knowledge base, concatenated as plain markdown. Generated
> from ${SITE}. Safe to paste in full into an agent's context window.

${parts.join("\n\n---\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
