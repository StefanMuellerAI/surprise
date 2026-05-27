"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { EntryMeta, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

export function EntryList({ initialEntries }: { initialEntries: EntryMeta[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntryMeta[]>(initialEntries);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) {
      setResults(initialEntries);
      setSearching(false);
      return;
    }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results as EntryMeta[]);
      setSearching(false);
    }, 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, initialEntries]);

  const isFiltered = query.trim().length > 0;

  return (
    <section>
      <div className="relative mb-4">
        <input
          type="search"
          placeholder="Search entries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
        {searching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted">
            …
          </span>
        )}
      </div>

      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {isFiltered
          ? `results · ${results.length}`
          : `entries · ${initialEntries.length}`}
      </h2>

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

      {isFiltered && results.length === 0 && !searching && (
        <p className="text-sm text-ink-muted">
          No results for &ldquo;{query}&rdquo;.
        </p>
      )}
      {!isFiltered && results.length === 0 && (
        <p className="text-ink-muted">No entries yet.</p>
      )}
    </section>
  );
}
