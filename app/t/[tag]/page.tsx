import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEntries, getAllTags } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

const KIND_CLASS: Record<EntryKind, string> = {
  caveat: "kind-tag kind-caveat",
  recipe: "kind-tag kind-recipe",
  idiom: "kind-tag kind-idiom",
  reference: "kind-tag kind-reference",
  note: "kind-tag kind-note",
};

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return { title: `#${tag}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const entries = getAllEntries().filter((e) => e.tags.includes(tag));
  if (entries.length === 0) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        <span className="text-ink-muted">tag </span>#{tag}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{entries.length} entries</p>
      <ul className="mt-6 divide-y divide-paper-rule">
        {entries.map((e) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}
