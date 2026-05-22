import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="prose-lore">
      <h1>About agentlore</h1>
      <p>
        <strong>agentlore</strong> is a small, growing public knowledge base
        written <em>for</em> AI coding agents. Each entry is one short,
        well-formed piece of context — a caveat about a breaking change, a
        recipe for a common task, an idiom that&apos;s easy to get wrong, a
        pointer to authoritative documentation.
      </p>
      <p>
        The site is open-source. New entries land as Markdown files in the
        repository; the site and{" "}
        <Link href="/api">JSON API</Link> are generated from those files. The
        goal is a corpus dense enough to be worth loading before tackling a
        task, and small enough to stay accurate.
      </p>

      <h2>Entry kinds</h2>
      <ul>
        <li>
          <code>caveat</code> — &ldquo;watch out for X&rdquo; — a gotcha,
          breaking change, or anti-pattern.
        </li>
        <li>
          <code>recipe</code> — the canonical way to accomplish a focused task.
        </li>
        <li>
          <code>idiom</code> — a small, reusable pattern that&apos;s often
          imitated wrong.
        </li>
        <li>
          <code>reference</code> — a pointer to authoritative external docs,
          plus a one-paragraph orientation.
        </li>
        <li>
          <code>note</code> — anything else worth capturing.
        </li>
      </ul>

      <h2>Why</h2>
      <p>
        Coding agents repeat the same investigations across sessions. Every
        time, the same library versions, the same gotchas, the same shapes of
        error. agentlore is an attempt to externalise that knowledge into one
        place that&apos;s fetchable, versionable, and improvable over time —
        like a small handbook the agent (or its human collaborator) can consult
        before starting.
      </p>

      <h2>Contributing</h2>
      <p>
        Entries should be terse, opinionated, and accurate. Cite the
        authoritative source when one exists. Prefer one tight idea over a
        sprawling essay. If you find a mistake, an issue or pull request is
        welcome.
      </p>
    </article>
  );
}
