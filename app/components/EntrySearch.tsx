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

function matches(e: EntryMeta, tokens: string[]): boolean {
  const hay = `${e.title} ${e.summary} ${e.tags.join(" ")} ${e.kind}`.toLowerCase();
  return tokens.every((t) => hay.includes(t));
}

export default function EntrySearch({ entries }: { entries: EntryMeta[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = tokens.length === 0 ? entries : entries.filter((e) => matches(e, tokens));

  return (
    <>
      <div className="mb-6">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='filter entries… (press / to focus)'
          className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
      </div>

      <ul className="divide-y divide-paper-rule">
        {visible.map((e) => (
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
        {visible.length === 0 && (
          <li className="py-6 text-sm text-ink-muted">
            No entries match <em>{query}</em>.
          </li>
        )}
      </ul>
    </>
  );
}
