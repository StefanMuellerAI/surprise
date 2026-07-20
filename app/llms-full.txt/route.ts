import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();
  const base = "https://agentlore.dev";

  const body = entries
    .map(
      (e) =>
        `# ${e.title}\n\n` +
        `slug: ${e.slug} · kind: ${e.kind} · updated: ${e.updated}\n` +
        `url: ${base}/e/${e.slug}\n` +
        (e.tags.length ? `tags: ${e.tags.join(", ")}\n` : "") +
        `\n${e.summary}\n\n${e.body}\n`,
    )
    .join("\n---\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
