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

export default function SearchableEntryList({ entries }: { entries: EntryMeta[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary?.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.kind.toLowerCase().includes(q)
      )
    : entries;

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted shrink-0">
          entries · {filtered.length}{q ? ` of ${entries.length}` : ""}
        </h2>
        <div className="relative flex-1 max-w-sm">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter… (press /)"
            className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-1 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
          />
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

      {filtered.length === 0 && (
        <p className="text-ink-muted">
          {q ? `No entries match "${query}".` : "No entries yet."}
        </p>
      )}
    </section>
  );
}
