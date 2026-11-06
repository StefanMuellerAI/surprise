import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// Whole corpus as plain markdown, ready to drop into an agent's context.
export async function GET() {
  const parts = getAllEntries().map(
    (e) =>
      `# ${e.title}\n\n` +
      `kind: ${e.kind} | tags: ${e.tags.join(", ")} | updated: ${e.updated}\n\n` +
      `${e.summary}\n\n${e.body}\n`,
  );
  return new Response(parts.join("\n---\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
