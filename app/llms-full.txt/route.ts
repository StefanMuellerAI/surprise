import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const body = entries
    .map((e) => {
      const meta = [
        `kind: ${e.kind}`,
        e.tags.length ? `tags: ${e.tags.join(", ")}` : null,
        `updated: ${e.updated}`,
        e.source ? `source: ${e.source}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `# ${e.title}\n\n${meta}\n\n${e.body}`;
    })
    .join("\n\n---\n\n");

  return new NextResponse(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
