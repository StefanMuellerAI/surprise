import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const meta = `kind: ${e.kind} · tags: ${e.tags.join(", ") || "none"} · updated: ${e.updated} · ${SITE_URL}/e/${e.slug}`;
      return `# ${e.title}\n\n${meta}\n\n${e.body}`;
    })
    .join("\n\n---\n\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
