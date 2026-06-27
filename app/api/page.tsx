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
    path: "/api/context",
    desc: "All entries as a plain-text block — paste directly into an agent system prompt.",
  },
  {
    method: "GET",
    path: "/api/context?tags=nextjs,react",
    desc: "Filter context by one or more tags (comma-separated, OR logic).",
  },
  {
    method: "GET",
    path: "/api/context?q=...",
    desc: "Full-text search — returns matching entries as plain text.",
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
        Example: JSON response
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

      <h2 className="mt-10 text-xl font-semibold tracking-tight">
        Example: context response (plain text)
      </h2>
      <p className="mt-2 max-w-prose text-ink-soft text-sm">
        <code>/api/context</code> returns <code>text/plain</code> — inject it
        directly into an agent system prompt with a single{" "}
        <code>fetch(…).then(r =&gt; r.text())</code>.
      </p>
      <pre className="mt-3 overflow-x-auto rounded-md bg-ink p-4 text-sm text-paper">
        <code>{`GET /api/context?tags=nextjs

# agentlore context — 1 entry matched tags=nextjs

---
## Next.js 15 async params [caveat]
> In Next.js 15, route params and searchParams are Promises.
tags: nextjs, react, async · slug: nextjs-15-async-params · updated: 2026-05-22

In Next.js 15, \`params\` and \`searchParams\` props in pages …`}</code>
      </pre>
    </article>
  );
}
