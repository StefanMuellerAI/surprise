import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

function buildLlmsFullTxt(): string {
  const entries = getAllEntries();
  const parts = entries.map((e) => {
    const meta = [
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      e.tags.length ? `tags: ${e.tags.join(", ")}` : null,
      `updated: ${e.updated}`,
      e.source ? `source: ${e.source}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    return `# ${e.title}\n\n${meta}\n\n${e.body}`;
  });

  return parts.join("\n\n---\n\n").trim() + "\n";
}

export async function GET() {
  return new NextResponse(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
