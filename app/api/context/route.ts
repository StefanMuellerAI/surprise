import type { Entry } from "@/lib/types";
import { getAllEntries, searchEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

function formatContext(entries: Entry[], descriptor: string): string {
  const count = entries.length;
  if (count === 0) {
    return `# agentlore context — no entries matched\n# query: ${descriptor || "(none)"}\n`;
  }
  const label = descriptor ? ` matched ${descriptor}` : "";
  const header = `# agentlore context — ${count} entr${count === 1 ? "y" : "ies"}${label}\n`;
  const sections = entries.map((e) => {
    const lines: string[] = [`---`, `## ${e.title} [${e.kind}]`];
    if (e.summary) lines.push(`> ${e.summary}`);
    const meta: string[] = [`slug: ${e.slug}`, `updated: ${e.updated}`];
    if (e.tags.length) meta.unshift(`tags: ${e.tags.join(", ")}`);
    if (e.source) meta.push(`source: ${e.source}`);
    lines.push(meta.join(" · "));
    lines.push("", e.body.trim());
    return lines.join("\n");
  });
  return header + "\n" + sections.join("\n\n") + "\n";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const tagsParam = url.searchParams.get("tags") ?? "";
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(limitParam ?? "20", 10) || 20),
  );

  let entries: Entry[];
  let descriptor: string;

  if (q) {
    entries = searchEntries(q, limit);
    descriptor = `q=${q}`;
  } else if (tagsParam) {
    const tags = tagsParam
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    entries = getAllEntries()
      .filter((e) => tags.some((t) => e.tags.includes(t)))
      .slice(0, limit);
    descriptor = `tags=${tagsParam}`;
  } else {
    entries = getAllEntries().slice(0, limit);
    descriptor = "";
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=60, s-maxage=300",
  };

  const text = formatContext(entries, descriptor);
  return new Response(text, {
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}
