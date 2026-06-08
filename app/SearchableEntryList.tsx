"use client";

import { useState } from "react";
import Link from "next/link";
import type { Entry, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

function filterEntries(entries: Entry[], query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  const tokens = q.split(/\s+/);
  return entries.filter((e) => {
    const hay = `${e.title} ${e.summary} ${e.tags.join(" ")}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}

export default function SearchableEntryList({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");
  const filtered = filterEntries(entries, query);
  const isFiltered = query.trim().length > 0;

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search entries…"
            className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-1.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
          />
          {isFiltered && (
            <button
              onClick={() => setQuery("")}
              aria-label="clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              ×
            </button>
          )}
        </div>
        <span className="shrink-0 text-xs font-mono text-ink-muted">
          {isFiltered ? `${filtered.length} / ${entries.length}` : `${entries.length}`}
        </span>
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

      {filtered.length === 0 && (
        <p className="text-sm text-ink-muted">
          {isFiltered ? `No entries match "${query.trim()}".` : "No entries yet."}
        </p>
      )}
    </section>
  );
}
