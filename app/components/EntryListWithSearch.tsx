"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { EntryMeta, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

function matches(entry: EntryMeta, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.summary.toLowerCase().includes(q) ||
    entry.kind.includes(q) ||
    entry.tags.some((t) => t.includes(q))
  );
}

export function EntryListWithSearch({ entries }: { entries: EntryMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => (query.trim() ? entries.filter((e) => matches(e, query.trim())) : entries),
    [entries, query]
  );

  return (
    <section>
      <div className="mb-6 relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search entries…"
          aria-label="Search entries"
          className="w-full rounded-md border border-paper-rule bg-paper-card px-4 py-2 pr-8 text-sm placeholder:text-ink-muted outline-none focus:border-ink transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        )}
      </div>

      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {query.trim()
          ? `results · ${filtered.length} of ${entries.length}`
          : `entries · ${entries.length}`}
      </h2>

      <ul className="divide-y divide-paper-rule">
        {filtered.map((e) => (
          <li key={e.slug} className="py-4">
            <div className="flex items-baseline gap-3">
              <span className={KIND_CLASS[e.kind]}>{e.kind}</span>
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

      {filtered.length === 0 && (
        <p className="py-8 text-center text-ink-muted">
          No entries match &ldquo;{query}&rdquo;.
        </p>
      )}
    </section>
  );
}
