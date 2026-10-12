import { getAllEntries, getEntry } from "@/lib/entries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

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
    return new Response(`# Not found\n\nNo entry with slug \`${slug}\`.\n`, {
      status: 404,
      headers,
    });
  }
  const md = `# ${entry.title}\n\n${entry.summary ? `> ${entry.summary}\n\n` : ""}${entry.body}\n`;
  return new Response(md, {
    headers: {
      ...headers,
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
