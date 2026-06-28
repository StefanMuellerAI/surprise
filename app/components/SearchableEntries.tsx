"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EntryKind, EntryMeta } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

export function SearchableEntries({
  initialEntries,
}: {
  initialEntries: EntryMeta[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntryMeta[]>(initialEntries);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(initialEntries);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&limit=50`,
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 220);
  }, [query, initialEntries]);

  const isFiltered = query.trim().length > 0;
  const label = isFiltered
    ? searching
      ? "searching…"
      : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query.trim()}"`
    : `entries · ${initialEntries.length}`;

  return (
    <section>
      <div className="mb-4 relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-ink-muted pointer-events-none select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries…"
          aria-label="Search entries"
          className="w-full rounded-md border border-paper-rule bg-paper-card py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
      </div>

      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {label}
      </h2>

      {results.length > 0 ? (
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
      ) : (
        <p className="text-ink-muted">
          {isFiltered && !searching ? "No entries match your search." : "No entries yet."}
        </p>
      )}
    </section>
  );
}
