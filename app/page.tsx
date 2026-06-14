import Link from "next/link";
import { getAllEntries, getAllTags } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

const KINDS: EntryKind[] = ["caveat", "recipe", "idiom", "reference", "note"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const activeKind = KINDS.find((k) => k === kind) ?? null;

  const allEntries = getAllEntries();
  const entries = activeKind
    ? allEntries.filter((e) => e.kind === activeKind)
    : allEntries;
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

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            entries · {entries.length}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {activeKind && (
              <Link
                href="/"
                className="no-underline text-xs text-ink-muted hover:text-ink"
              >
                all ×
              </Link>
            )}
            {KINDS.map((k) => (
              <Link
                key={k}
                href={activeKind === k ? "/" : `/?kind=${k}`}
                className={[
                  KIND_CLASS[k],
                  "no-underline transition-opacity",
                  activeKind === k
                    ? "ring-1 ring-current"
                    : activeKind
                      ? "opacity-40 hover:opacity-80"
                      : "opacity-60 hover:opacity-100",
                ].join(" ")}
              >
                {k}
              </Link>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-paper-rule">
          {entries.map((e) => (
            <li key={e.slug} className="py-4">
              <div className="flex items-baseline gap-3">
                <Link
                  href={activeKind === e.kind ? "/" : `/?kind=${e.kind}`}
                  className={`${KIND_CLASS[e.kind]} no-underline`}
                >
                  {e.kind}
                </Link>
                <Link
                  href={`/e/${e.slug}`}
                  className="no-underline text-lg font-medium hover:underline"
                >
                  {e.title}
                </Link>
              </div>
              {e.summary && (
                <p className="mt-1 text-sm text-ink-soft">{e.summary}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                <time dateTime={e.updated}>{e.updated}</time>
                {e.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/t/${tag}`}
                    className="no-underline hover:text-ink"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {entries.length === 0 && (
          <p className="text-ink-muted">
            No {activeKind} entries yet.{" "}
            <Link href="/">Show all entries</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
