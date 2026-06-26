import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KNOWN_KINDS: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

export const dynamic = "force-static";

function formatContext(entries: ReturnType<typeof getAllEntries>, date: string): string {
  const lines: string[] = [
    `# agentlore — field notes for AI coding agents`,
    `Generated: ${date} | Entries: ${entries.length}`,
    ``,
    `Load this document as pre-flight context before starting a coding task.`,
    `Each entry is a caveat, recipe, idiom, reference, or note curated for AI agents.`,
  ];

  for (const e of entries) {
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`## [${e.kind}] ${e.title}`);

    const meta: string[] = [`Updated: ${e.updated}`];
    if (e.tags.length > 0) meta.unshift(`Tags: ${e.tags.join(", ")}`);
    if (e.source) meta.push(`Source: ${e.source}`);
    lines.push(meta.join(" | "));

    if (e.summary) {
      lines.push(``);
      lines.push(`> ${e.summary}`);
    }

    if (e.body) {
      lines.push(``);
      lines.push(e.body);
    }
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(`End of agentlore context.`);

  return lines.join("\n");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const kindParam = url.searchParams.get("kind");

  let entries = getAllEntries();
  if (tag) entries = entries.filter((e) => e.tags.includes(tag));
  if (kindParam && (KNOWN_KINDS as readonly string[]).includes(kindParam)) {
    entries = entries.filter((e) => e.kind === kindParam);
  }

  const date = new Date().toISOString().slice(0, 10);
  const text = formatContext(entries, date);

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
