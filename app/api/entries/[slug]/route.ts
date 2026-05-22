import { NextResponse } from "next/server";
import { getAllEntries, getEntry, renderEntry } from "@/lib/entries";

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
    return NextResponse.json(
      { error: "not_found", slug },
      {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
  }
  const rendered = await renderEntry(entry);
  return NextResponse.json(
    { ...rendered, body: entry.body },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}
