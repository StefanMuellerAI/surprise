"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EntryKind, EntryMeta } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

function matches(entry: EntryMeta, tokens: string[]): boolean {
  const hay = (
    entry.title +
    "\n" +
    entry.summary +
    "\n" +
    entry.kind +
    "\n" +
    entry.tags.join(" ")
  ).toLowerCase();
  return tokens.every((t) => hay.includes(t));
}

export function SearchFilter({ entries }: { entries: EntryMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return entries;
    return entries.filter((e) => matches(e, tokens));
  }, [entries, query]);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          entries · {filtered.length}
          {filtered.length !== entries.length && ` / ${entries.length}`}
        </h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter entries…"
          aria-label="Filter entries"
          className="w-40 rounded-md border border-paper-rule bg-paper-card px-2.5 py-1 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none sm:w-56"
        />
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
      {entries.length === 0 && (
        <p className="text-ink-muted">No entries yet.</p>
      )}
      {entries.length > 0 && filtered.length === 0 && (
        <p className="text-ink-muted">No entries match &ldquo;{query}&rdquo;.</p>
      )}
    </section>
  );
}
