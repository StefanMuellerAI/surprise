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

function filterEntries(entries: EntryMeta[], query: string): EntryMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  const tokens = q.split(/\s+/);
  return entries.filter((e) => {
    const haystack = [e.title, e.summary ?? "", ...e.tags, e.kind]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
}

export function EntryList({ entries }: { entries: EntryMeta[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterEntries(entries, query),
    [entries, query]
  );

  return (
    <section>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter entries…"
          className="w-full rounded-md border border-paper-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
      </div>
      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {query
          ? `${filtered.length} of ${entries.length} entries`
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
        <p className="text-ink-muted">
          {query ? `No entries match "${query}".` : "No entries yet."}
        </p>
      )}
    </section>
  );
}
