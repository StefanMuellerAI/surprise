export const SITE_URL = "https://agentlore.dev";

export type EntryKind = "caveat" | "recipe" | "idiom" | "reference" | "note";

export interface EntryMeta {
  slug: string;
  title: string;
  summary: string;
  kind: EntryKind;
  tags: string[];
  created: string; // ISO date
  updated: string; // ISO date
  related: string[]; // other slugs
  source?: string; // optional URL to authoritative source
}

export interface Entry extends EntryMeta {
  body: string; // raw markdown
}

export interface EntryRendered extends EntryMeta {
  html: string;
}
