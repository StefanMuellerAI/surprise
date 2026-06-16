"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { EntryMeta, EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

function matches(entry: EntryMeta, tokens: string[]): boolean {
  const haystack = [entry.title, entry.summary, entry.kind, ...entry.tags]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export function EntryList({ entries }: { entries: EntryMeta[] }) {
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
        setQuery("");
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered =
    tokens.length === 0 ? entries : entries.filter((e) => matches(e, tokens));

  return (
    <section>
      <div className="mb-6 relative">
        <input
          ref={inputRef}
          type="search"
          placeholder="search entries… (press / to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 pr-8 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
        {tokens.length > 0
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

      {filtered.length === 0 && tokens.length > 0 && (
        <p className="py-4 text-sm text-ink-muted">
          No entries match <em>{query}</em>.
        </p>
      )}
      {entries.length === 0 && tokens.length === 0 && (
        <p className="text-ink-muted">No entries yet.</p>
      )}
    </section>
  );
}
