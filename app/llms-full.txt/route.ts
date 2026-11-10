import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

// All entries concatenated as markdown, ready to drop into an agent's context.
export function GET() {
  const parts = getAllEntries().map(
    (e) =>
      `# ${e.title}\n\n- kind: ${e.kind}\n- tags: ${e.tags.join(", ")}\n- updated: ${e.updated}\n${e.source ? `- source: ${e.source}\n` : ""}\n${e.body}\n`,
  );
  return new Response(`${parts.join("\n---\n\n")}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
