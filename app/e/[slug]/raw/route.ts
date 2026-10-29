import { getAllEntries, getEntry } from "@/lib/entries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

// Plain-markdown view of an entry: cheap to fetch and ready to drop into an
// agent's context window (no HTML, no JSON envelope).
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const entry = getEntry(slug);
  if (!entry) {
    return new Response("not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const head = [
    `# ${entry.title}`,
    entry.summary && `> ${entry.summary}`,
    `kind: ${entry.kind} · tags: ${entry.tags.join(", ") || "-"} · updated: ${entry.updated}`,
    entry.source && `source: ${entry.source}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return new Response(`${head}\n\n${entry.body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
