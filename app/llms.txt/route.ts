import { getAllEntries } from "@/lib/entries";
import type { EntryKind } from "@/lib/types";

export const dynamic = "force-static";

const BASE_URL = "https://agentlore.dev";

const KIND_LABELS: Record<EntryKind, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KINDS: EntryKind[] = ["caveat", "recipe", "idiom", "reference", "note"];

export function GET() {
  const entries = getAllEntries();

  const sections = KINDS.flatMap((kind) => {
    const kindEntries = entries.filter((e) => e.kind === kind);
    if (kindEntries.length === 0) return [];
    const lines = kindEntries
      .map((e) => `- [${e.title}](${BASE_URL}/e/${e.slug}): ${e.summary}`)
      .join("\n");
    return [`## ${KIND_LABELS[kind]}\n\n${lines}`];
  }).join("\n\n");

  const body =
    `# agentlore\n\n` +
    `> A curated knowledge base of field notes for AI coding agents — caveats, recipes, idioms, references, and notes.\n\n` +
    `Entries are terse and opinionated. Each is tagged by kind: ` +
    `caveats warn about pitfalls, recipes give step-by-step solutions, ` +
    `idioms describe idiomatic patterns, references point to authoritative sources, ` +
    `notes are general observations. A machine-readable JSON API is available at ${BASE_URL}/api.\n\n` +
    `## API\n\n` +
    `- [All Entries](${BASE_URL}/api/entries): JSON list of all entries with metadata\n` +
    `- [Search](${BASE_URL}/api/search): Full-text search — GET /api/search?q=...\n` +
    `- [Tags](${BASE_URL}/api/tags): All tags with usage counts\n` +
    `- [API Documentation](${BASE_URL}/api): Interactive API docs with example responses\n\n` +
    sections +
    "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
