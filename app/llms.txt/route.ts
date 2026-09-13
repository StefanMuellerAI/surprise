import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE = "https://agentlore.dev";

function groupByKind(entries: ReturnType<typeof getAllEntries>) {
  const groups = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = groups.get(e.kind) ?? [];
    list.push(e);
    groups.set(e.kind, list);
  }
  return groups;
}

export async function GET() {
  const entries = getAllEntries();
  const groups = groupByKind(entries);

  const lines: string[] = [];
  lines.push("# agentlore");
  lines.push("");
  lines.push(
    "> Field notes for AI coding agents — caveats, recipes, idioms, and " +
      "references worth loading before tackling a task.",
  );
  lines.push("");
  lines.push(
    `Full JSON API: ${SITE}/api (see ${SITE}/api for all routes). ` +
      "CORS is open on every endpoint.",
  );
  lines.push("");

  for (const [kind, kindEntries] of [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(`## ${kind}`);
    lines.push("");
    for (const e of kindEntries) {
      const summary = e.summary ? `: ${e.summary}` : "";
      lines.push(`- [${e.title}](${SITE}/e/${e.slug})${summary}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n").trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
