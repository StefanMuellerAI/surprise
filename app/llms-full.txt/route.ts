import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const header = [
      `# ${e.title}`,
      "",
      `kind: ${e.kind} · tags: ${e.tags.join(", ") || "none"} · updated: ${e.updated}`,
      e.summary,
      "",
      e.body,
    ];
    return header.filter(Boolean).join("\n");
  });

  const body = sections.join("\n\n---\n\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
