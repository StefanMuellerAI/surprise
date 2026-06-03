import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

function toPlainText(entries: ReturnType<typeof getAllEntries>): string {
  const lines: string[] = [
    `# agentlore — full context dump`,
    `Generated: ${new Date().toISOString().slice(0, 10)} | Entries: ${entries.length}`,
    "",
  ];

  for (const entry of entries) {
    lines.push("---", "");
    lines.push(`## ${entry.title} [${entry.kind}]`);

    const meta: string[] = [`Updated: ${entry.updated}`];
    if (entry.tags.length > 0) meta.unshift(`Tags: ${entry.tags.join(", ")}`);
    if (entry.source) meta.push(`Source: ${entry.source}`);
    lines.push(meta.join(" | "));
    lines.push("");

    if (entry.summary) {
      lines.push(entry.summary, "");
    }

    if (entry.body) {
      lines.push(entry.body, "");
    }
  }

  lines.push("---");
  return lines.join("\n");
}

const CORS = { "Access-Control-Allow-Origin": "*" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "text";
  const entries = getAllEntries();

  if (format === "json") {
    return NextResponse.json(
      { generated: new Date().toISOString(), count: entries.length, entries },
      { headers: { ...CORS, "Cache-Control": "public, max-age=60, s-maxage=300" } },
    );
  }

  return new Response(toPlainText(entries), {
    headers: {
      ...CORS,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
