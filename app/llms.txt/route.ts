import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const entries = getAllEntries();
  const byKind = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byKind.get(e.kind) ?? [];
    list.push(e);
    byKind.set(e.kind, list);
  }

  const lines: string[] = [
    "# agentlore",
    "",
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references. Public knowledge base with a JSON API.",
    "",
    "Full corpus in one request: /llms-full.txt",
    "JSON API docs: /api",
    "",
  ];

  for (const [kind, list] of [...byKind.entries()].sort()) {
    lines.push(`## ${kind}`, "");
    for (const e of list) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

export async function GET() {
  return new NextResponse(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
