import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

export function GET() {
  const parts = getAllEntries().map((e) =>
    [
      `# ${e.title}`,
      "",
      `kind: ${e.kind}`,
      e.tags.length ? `tags: ${e.tags.join(", ")}` : "",
      `updated: ${e.updated}`,
      e.summary ? `\n> ${e.summary}` : "",
      "",
      e.body,
    ]
      .filter((l, i) => l !== "" || i > 0)
      .join("\n"),
  );
  return new Response(parts.join("\n\n---\n\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
