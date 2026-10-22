import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Entry, EntryKind, EntryMeta, EntryRendered } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "entries");

const KNOWN_KINDS: readonly EntryKind[] = [
  "caveat",
  "recipe",
  "idiom",
  "reference",
  "note",
];

function parseFile(filename: string): Entry {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const slug =
    typeof data.slug === "string" && data.slug.length > 0
      ? data.slug
      : filename.replace(/\.md$/, "");

  const kindCandidate = typeof data.kind === "string" ? data.kind : "note";
  const kind: EntryKind = (KNOWN_KINDS as readonly string[]).includes(
    kindCandidate,
  )
    ? (kindCandidate as EntryKind)
    : "note";

  const created =
    typeof data.created === "string"
      ? data.created
      : data.created instanceof Date
        ? data.created.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

  const updated =
    typeof data.updated === "string"
      ? data.updated
      : data.updated instanceof Date
        ? data.updated.toISOString().slice(0, 10)
        : created;

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    kind,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    created,
    updated,
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    source: typeof data.source === "string" ? data.source : undefined,
    body: content.trim(),
  };
}

let cache: Entry[] | null = null;

export function getAllEntries(): Entry[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const entries = files.map(parseFile);
  entries.sort((a, b) => (a.updated < b.updated ? 1 : -1));
  cache = entries;
  return entries;
}

export function getEntry(slug: string): Entry | undefined {
  return getAllEntries().find((e) => e.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of getAllEntries()) {
    for (const t of e.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function toMeta(entry: Entry): EntryMeta {
  const { body: _body, ...meta } = entry;
  void _body;
  return meta;
}

export async function renderEntry(entry: Entry): Promise<EntryRendered> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(entry.body);
  return { ...toMeta(entry), html: String(processed) };
}

export function searchEntries(query: string, limit = 25): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);
  const scored = getAllEntries()
    .map((e) => {
      const hay = (
        e.title +
        "\n" +
        e.summary +
        "\n" +
        e.tags.join(" ") +
        "\n" +
        e.body
      ).toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (!hay.includes(t)) return { entry: e, score: 0 };
        if (e.title.toLowerCase().includes(t)) score += 5;
        if (e.tags.some((tag) => tag.toLowerCase().includes(t))) score += 3;
        if (e.summary.toLowerCase().includes(t)) score += 2;
        score += 1;
      }
      return { entry: e, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((r) => r.entry);
}

/** Explicit `related` slugs first, then entries sharing the most tags. */
export function getRelatedEntries(entry: Entry, limit = 4): Entry[] {
  const explicit = entry.related
    .map((s) => getEntry(s))
    .filter((e): e is Entry => Boolean(e));
  const seen = new Set([entry.slug, ...explicit.map((e) => e.slug)]);
  const tags = new Set(entry.tags);
  const byTags = getAllEntries()
    .filter((e) => !seen.has(e.slug))
    .map((e) => ({ e, shared: e.tags.filter((t) => tags.has(t)).length }))
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared);
  return [...explicit, ...byTags.map((r) => r.e)].slice(0, limit);
}
