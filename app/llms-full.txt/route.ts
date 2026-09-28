import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const meta = [
      `kind: ${e.kind}`,
      e.tags.length ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return [
      `## ${e.title}`,
      "",
      `_${meta}_`,
      "",
      e.summary,
      "",
      e.body,
    ].join("\n");
  });

  const text = [
    "# agentlore — full corpus",
    "",
    "> Every entry's full content in one file, for agents that want to load",
    "> the whole knowledge base at once instead of paginating the API.",
    "",
    sections.join("\n\n---\n\n"),
    "",
  ].join("\n");

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
