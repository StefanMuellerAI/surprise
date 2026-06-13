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

interface Props {
  entries: EntryMeta[];
}

export default function SearchableEntryList({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntryMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=25`,
      );
      const data = await res.json();
      setResults(data.results ?? []);
      setLoading(false);
    }, 180);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const active = query.trim().length > 0;
  const list = active ? results : entries;

  return (
    <section>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search entries…"
        className="mb-5 w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
      />
      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {active
          ? loading
            ? "searching…"
            : `results · ${results.length}`
          : `entries · ${entries.length}`}
      </h2>
      <ul className="divide-y divide-paper-rule">
        {list.map((e) => (
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
      {active && !loading && results.length === 0 && (
        <p className="text-sm text-ink-muted">
          No entries match &ldquo;{query}&rdquo;.
        </p>
      )}
      {!active && entries.length === 0 && (
        <p className="text-ink-muted">No entries yet.</p>
      )}
    </section>
  );
}
