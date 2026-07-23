import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const SITE_URL = "https://agentlore.dev";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
  const entries = getAllEntries();
  const items = entries
    .map((e) => {
      const link = `${SITE_URL}/e/${e.slug}`;
      return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(e.summary)}</description>
      <category>${escapeXml(e.kind)}</category>
      <pubDate>${toRfc822(e.updated)}</pubDate>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = entries.length
    ? toRfc822(entries[0].updated)
    : new Date(0).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>agentlore</title>
    <link>${SITE_URL}</link>
    <description>Field notes for AI coding agents — caveats, recipes, idioms, and references.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
