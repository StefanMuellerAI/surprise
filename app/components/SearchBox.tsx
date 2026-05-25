"use client";

import { useState, useEffect, useRef } from "react";
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
  initialEntries: EntryMeta[];
}

export function SearchBox({ initialEntries }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntryMeta[]>(initialEntries);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(initialEntries);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results as EntryMeta[]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, initialEntries]);

  const isActive = query.trim().length > 0;
  const shown = isActive ? results : initialEntries;

  let label: string;
  if (isSearching) {
    label = "searching…";
  } else if (isActive) {
    label = `${results.length} result${results.length === 1 ? "" : "s"} for "${query.trim()}"`;
  } else {
    label = `entries · ${initialEntries.length}`;
  }

  return (
    <>
      <div className="mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search entries…"
          className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
      </div>

      <section>
        <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
          {label}
        </h2>
        <ul className="divide-y divide-paper-rule">
          {shown.map((e) => (
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
        {!isSearching && shown.length === 0 && (
          <p className="text-ink-muted">
            {isActive
              ? `No entries match "${query.trim()}".`
              : "No entries yet."}
          </p>
        )}
      </section>
    </>
  );
}
