import { getAllEntries } from "@/lib/entries";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Demote body headings so each entry stays under its own H1. Fenced code is
// left alone: a "# comment" in a shell snippet is not a heading.
function demoteHeadings(md: string): string {
  let inFence = false;
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      return inFence ? line : line.replace(/^(#{1,5}) /, "#$1 ");
    })
    .join("\n");
}

// Every entry, raw Markdown, in one request — no HTML or JSON to unwrap.
export function GET() {
  const parts = getAllEntries().map((e) =>
    [
      `# ${e.title}`,
      "",
      ...(e.summary ? [`> ${e.summary}`, ""] : []),
      `- url: ${SITE_URL}/e/${e.slug}`,
      `- kind: ${e.kind}`,
      ...(e.tags.length ? [`- tags: ${e.tags.join(", ")}`] : []),
      `- updated: ${e.updated}`,
      ...(e.source ? [`- source: ${e.source}`] : []),
      "",
      demoteHeadings(e.body),
    ].join("\n"),
  );
  return new Response(parts.join("\n\n---\n\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
