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
];

const TEXT_ROUTES: { path: string; desc: string }[] = [
  {
    path: "/llms.txt",
    desc: "Machine-readable index of all entries — titles, summaries, URLs, grouped by kind. Follows the llms.txt convention.",
  },
  {
    path: "/llms-full.txt",
    desc: "Complete plain-text dump of every entry including full body. Load this as context to give an agent the entire knowledge base.",
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
        Plain-text endpoints
      </h2>
      <p className="mt-2 max-w-prose text-ink-soft">
        Two plain-text routes follow the{" "}
        <a
          href="https://llmstxt.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          llms.txt
        </a>{" "}
        convention — useful when you want to load the knowledge base directly
        into an agent&apos;s context window without parsing JSON.
      </p>

      <div className="mt-4 overflow-hidden rounded-md border border-paper-rule bg-paper-card">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left text-xs uppercase tracking-wider text-ink-muted">
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {TEXT_ROUTES.map((r) => (
              <tr key={r.path} className="border-t border-paper-rule">
                <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                  {r.path}
                </td>
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
