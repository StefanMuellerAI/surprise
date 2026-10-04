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
  const header = [
    `# ${entry.title}`,
    "",
    entry.summary ? `> ${entry.summary}` : null,
    entry.summary ? "" : null,
    `kind: ${entry.kind} · tags: ${entry.tags.join(", ") || "-"} · updated: ${entry.updated}`,
    "",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
  return new Response(`${header}\n${entry.body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
