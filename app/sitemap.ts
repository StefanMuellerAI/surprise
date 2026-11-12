import type { MetadataRoute } from "next";
import { getAllEntries, getAllTags } from "@/lib/entries";

const BASE = "https://agentlore.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getAllEntries();
  // getAllEntries() sorts newest-first, so the first entry dates the index pages.
  const latest = entries[0]?.updated;

  return [
    { url: BASE, lastModified: latest },
    { url: `${BASE}/api`, lastModified: latest },
    { url: `${BASE}/about` },
    ...entries.map((e) => ({
      url: `${BASE}/e/${encodeURIComponent(e.slug)}`,
      lastModified: e.updated,
    })),
    ...getAllTags().map(({ tag }) => ({
      url: `${BASE}/t/${encodeURIComponent(tag)}`,
    })),
  ];
}
