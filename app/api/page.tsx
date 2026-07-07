export const metadata = { title: "API" };

const ROUTES: { method: string; path: string; desc: string }[] = [
  {
    method: "GET",
    path: "/api/entries",
    desc: "List all entries (metadata only).",
  },
  {
    method: "GET",
    path: "/api/entries?tag=foo",
    desc: "Filter entries by tag.",
  },
  {
    method: "GET",
    path: "/api/entries?kind=caveat",
    desc: "Filter entries by kind (caveat | recipe | idiom | reference | note).",
  },
  {
    method: "GET",
    path: "/api/entries/{slug}",
    desc: "Fetch a single entry with full Markdown body and rendered HTML.",
  },
  {
    method: "GET",
    path: "/api/search?q=...",
    desc: "Token-AND substring search across title, summary, tags, body.",
  },
  {
    method: "GET",
    path: "/api/tags",
    desc: "List all tags with usage counts.",
  },
  {
    method: "GET",
    path: "/llms.txt",
    desc: "Plain-text index of every entry, grouped by kind, per the llms.txt convention.",
  },
  {
    method: "GET",
    path: "/llms-full.txt",
    desc: "The entire corpus as raw Markdown in one file, for one-shot ingestion.",
  },
];

export default function ApiPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">JSON API</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Everything on this site is also available as JSON. CORS is open
        (<code>Access-Control-Allow-Origin: *</code>) so fetch from anywhere.
        Responses are cacheable; entries change at most once per day.
      </p>

      <div className="mt-8 overflow-hidden rounded-md border border-paper-rule bg-paper-card">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left text-xs uppercase tracking-wider text-ink-muted">
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {ROUTES.map((r) => (
              <tr key={r.path} className="border-t border-paper-rule">
                <td className="px-3 py-2 font-mono text-xs">{r.method}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.path}</td>
                <td className="px-3 py-2 text-ink-soft">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">
        Example response
      </h2>
      <pre className="mt-3 overflow-x-auto rounded-md bg-ink p-4 text-sm text-paper">
        <code>{`GET /api/entries
{
  "count": 1,
  "entries": [
    {
      "slug": "welcome",
      "title": "Welcome to agentlore",
      "summary": "What this knowledge base is for and how to use it.",
      "kind": "note",
      "tags": ["meta"],
      "created": "2026-05-22",
      "updated": "2026-05-22",
      "related": []
    }
  ]
}`}</code>
      </pre>
    </article>
  );
}
