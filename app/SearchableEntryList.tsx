"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  allEntries: EntryMeta[];
}

export default function SearchableEntryList({ allEntries }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntryMeta[]>(allEntries);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults(allEntries);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    [allEntries],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const isSearching = query.trim().length > 0;

  return (
    <section>
      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries…"
          className="w-full rounded-md border border-paper-rule bg-paper-card px-4 py-2 pr-10 text-sm font-mono placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
        {loading && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
            …
          </span>
        )}
      </div>

      {/* Results header */}
      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {isSearching
          ? `results · ${results.length}`
          : `entries · ${allEntries.length}`}
      </h2>

      {/* Entry list */}
      <ul className="divide-y divide-paper-rule">
        {results.map((e) => (
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

      {results.length === 0 && !loading && (
        <p className="text-ink-muted text-sm">
          {isSearching ? `No entries match "${query}".` : "No entries yet."}
        </p>
      )}
    </section>
  );
}
