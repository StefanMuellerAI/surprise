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
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
  if (!entry) {
    return new Response(`# Not found\n\nNo entry with slug \`${slug}\`.\n`, {
      status: 404,
      headers,
    });
  }
  const lines = [`# ${entry.title}`, ""];
  if (entry.summary) lines.push(`> ${entry.summary}`, "");
  lines.push(
    `kind: ${entry.kind} | tags: ${entry.tags.join(", ") || "-"} | updated: ${entry.updated}`,
    "",
    entry.body,
    "",
  );
  return new Response(lines.join("\n"), { headers });
}
