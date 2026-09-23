import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

export function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const header = [
      `# ${e.title}`,
      "",
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      `url: ${SITE}/e/${e.slug}`,
      e.source ? `source: ${e.source}` : undefined,
      "",
      e.summary,
      "",
      e.body,
    ].filter((line) => line !== undefined);
    return header.join("\n");
  });

  const body =
    `# agentlore — full corpus\n\n` +
    `> Every entry, concatenated. See ${SITE}/llms.txt for an index, ` +
    `${SITE}/api for JSON.\n\n` +
    sections.join("\n\n---\n\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
