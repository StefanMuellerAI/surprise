import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllEntries,
  getEntry,
  renderEntry,
} from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return { title: "Not found" };
  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const rendered = await renderEntry(entry);

  return (
    <article>
      <div className="mb-6">
        <div className="mb-3 flex items-baseline gap-3">
          <span className={KIND_CLASS[entry.kind]}>{entry.kind}</span>
          <span className="font-mono text-xs text-ink-muted">{entry.slug}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{entry.title}</h1>
        {entry.summary && (
          <p className="mt-2 text-lg text-ink-soft">{entry.summary}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span>created {entry.created}</span>
          {entry.updated !== entry.created && (
            <span>updated {entry.updated}</span>
          )}
          {entry.tags.map((tag) => (
            <Link
              key={tag}
              href={`/t/${tag}`}
              className="no-underline hover:text-ink"
            >
              #{tag}
            </Link>
          ))}
          {entry.source && (
            <a
              href={entry.source}
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:text-ink"
            >
              source ↗
            </a>
          )}
        </div>
      </div>

      <div
        className="prose-lore"
        dangerouslySetInnerHTML={{ __html: rendered.html }}
      />

      {entry.related.length > 0 && (
        <section className="mt-12 border-t border-paper-rule pt-4">
          <h2 className="mb-2 text-xs font-mono uppercase tracking-wider text-ink-muted">
            related
          </h2>
          <ul className="space-y-1">
            {entry.related.map((s) => {
              const r = getEntry(s);
              if (!r) return null;
              return (
                <li key={s}>
                  <Link href={`/e/${s}`} className="text-sm">
                    {r.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-12 text-xs text-ink-muted">
        Fetch as JSON:{" "}
        <code>
          GET /api/entries/{entry.slug}
        </code>{" "}
        or as Markdown:{" "}
        <a href={`/api/entries/${entry.slug}/raw`}>
          <code>/api/entries/{entry.slug}/raw</code>
        </a>
      </section>
    </article>
  );
}
