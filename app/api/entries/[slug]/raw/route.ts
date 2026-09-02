import matter from "gray-matter";
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
  if (!entry) {
    return new Response(`not found: ${slug}\n`, {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const { body: _body, ...meta } = entry;
  void _body;
  const frontmatter = Object.fromEntries(
    Object.entries(meta).filter(([, v]) => v !== undefined),
  );
  const raw = matter.stringify(entry.body, frontmatter);

  return new Response(raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
