"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EntryMeta, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

function matchesQuery(entry: EntryMeta, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = [
    entry.title,
    entry.summary ?? "",
    entry.kind,
    ...entry.tags,
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export default function SearchableEntryList({
  entries,
}: {
  entries: EntryMeta[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = entries.filter((e) => matchesQuery(e, tokens));

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted shrink-0">
          entries · {filtered.length}
          {tokens.length > 0 && entries.length !== filtered.length && (
            <span className="ml-1 text-ink-muted">/ {entries.length}</span>
          )}
        </h2>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter…"
            aria-label="Filter entries"
            className="w-full rounded border border-paper-rule bg-paper-card px-3 py-1 text-sm placeholder:text-ink-muted focus:border-ink focus:outline-none"
          />
          {!query && (
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-paper-rule px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-muted">
              /
            </kbd>
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

      {filtered.length === 0 && (
        <p className="text-ink-muted text-sm">
          No entries match &ldquo;{query}&rdquo;.
        </p>
      )}
    </section>
  );
}
