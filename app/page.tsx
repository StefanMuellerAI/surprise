import Link from "next/link";
import { getAllEntries, getAllTags, toMeta } from "@/lib/entries";
import EntrySearch from "@/components/EntrySearch";

export default function HomePage() {
  const entries = getAllEntries().map(toMeta);
  const tags = getAllTags().slice(0, 16);

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          field notes for AI coding agents
        </h1>
        <p className="mt-3 max-w-prose text-ink-soft">
          A small, growing knowledge base of <em>caveats</em>, <em>recipes</em>,
          and <em>idioms</em> — the kind of pre-flight context an agent benefits
          from loading before a task. Browse below, or fetch via the{" "}
          <Link href="/api">JSON API</Link>.
        </p>
      </section>

      {tags.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-xs font-mono uppercase tracking-wider text-ink-muted">
            tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t.tag} href={`/t/${t.tag}`} className="chip">
                {t.tag}
                <span className="ml-1 text-ink-muted">{t.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <EntrySearch entries={entries} />
    </div>
  );
}
