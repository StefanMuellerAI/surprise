"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EntryKind, EntryMeta } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

interface TagCount {
  tag: string;
  count: number;
}

interface Props {
  entries: EntryMeta[];
  tags: TagCount[];
}

export default function HomeContent({ entries, tags }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (e.key === "/" && active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const q = query.trim().toLowerCase();
  const visible = q
    ? entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.kind.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      )
    : entries;

  return (
    <div>
      <div className="mb-8 relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search entries…"
          className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />
        {!query && (
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-paper-rule px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-muted">
            /
          </kbd>
        )}
      </div>

      {!q && tags.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-xs font-mono uppercase tracking-wider text-ink-muted">
            tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t.tag} href={`/t/${t.tag}`} className="chip">
                {t.tag}
                <span className="ml-1 text-ink-muted">{t.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-ink-muted">
          {q ? `results · ${visible.length}` : `entries · ${entries.length}`}
        </h2>
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
        </ul>
        {q && visible.length === 0 && (
          <p className="text-ink-muted">No entries match &ldquo;{query}&rdquo;.</p>
        )}
        {!q && entries.length === 0 && (
          <p className="text-ink-muted">No entries yet.</p>
        )}
      </section>
    </div>
  );
}
