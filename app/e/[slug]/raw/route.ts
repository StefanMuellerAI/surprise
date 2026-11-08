import { getAllEntries, getEntry } from "@/lib/entries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

// Plain-markdown view of an entry (title + summary + body), ready to paste
// into an agent's context without JSON or HTML overhead.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const entry = getEntry(slug);
  if (!entry) {
    return new Response("not found\n", { status: 404 });
  }
  const text = [
    `# ${entry.title}`,
    entry.summary ? `\n> ${entry.summary}` : "",
    `\n_${entry.kind} · ${entry.tags.map((t) => `#${t}`).join(" ")}_\n`,
    entry.body.trim(),
    entry.source ? `\nSource: ${entry.source}` : "",
    "",
  ].join("\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
