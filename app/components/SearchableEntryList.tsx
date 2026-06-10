"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { EntryMeta, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

interface Props {
  entries: EntryMeta[];
}

export default function SearchableEntryList({ entries }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary?.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.kind.toLowerCase().includes(q)
    );
  }, [entries, query]);

  return (
    <section>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted shrink-0">
          entries · {filtered.length === entries.length ? entries.length : `${filtered.length} / ${entries.length}`}
        </h2>
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search entries…"
            className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-1.5 text-sm text-ink placeholder-ink-muted outline-none focus:border-ink-muted focus:ring-1 focus:ring-ink-muted"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink no-underline"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

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

      {filtered.length === 0 && query && (
        <p className="py-6 text-center text-ink-muted text-sm">
          No entries match <em>&ldquo;{query}&rdquo;</em>.
        </p>
      )}
      {entries.length === 0 && !query && (
        <p className="text-ink-muted">No entries yet.</p>
      )}
    </section>
  );
}
