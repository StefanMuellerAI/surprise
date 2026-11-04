import { getAllEntries, getEntry } from "@/lib/entries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

// Plain-markdown version of an entry: cheap to load into an agent's context.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const entry = getEntry(slug);
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };
  if (!entry) {
    return new Response(`# Not found\n\nNo entry "${slug}".\n`, {
      status: 404,
      headers,
    });
  }
  const meta = [
    `kind: ${entry.kind}`,
    entry.tags.length ? `tags: ${entry.tags.join(", ")}` : null,
    `updated: ${entry.updated}`,
    entry.source ? `source: ${entry.source}` : null,
  ].filter(Boolean);
  const text = `# ${entry.title}\n\n${entry.summary ? `> ${entry.summary}\n\n` : ""}${meta.join(" · ")}\n\n${entry.body}\n`;
  return new Response(text, {
    headers: {
      ...headers,
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
