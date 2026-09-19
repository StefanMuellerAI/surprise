import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const entries = getAllEntries();

  const sections = entries.map((e) => {
    const header = [
      `# ${e.title}`,
      "",
      `slug: ${e.slug}`,
      `kind: ${e.kind}`,
      `tags: ${e.tags.join(", ")}`,
      `updated: ${e.updated}`,
      `url: /e/${e.slug}`,
      e.source ? `source: ${e.source}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
    return `${header}\n\n${e.body}`;
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
