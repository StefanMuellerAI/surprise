import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-static";

const KIND_LABEL: Record<string, string> = {
  caveat: "Caveats",
  recipe: "Recipes",
  idiom: "Idioms",
  reference: "References",
  note: "Notes",
};

const KIND_ORDER = ["caveat", "recipe", "idiom", "reference", "note"];

export async function GET() {
  const entries = getAllEntries();
  const byKind = new Map<string, typeof entries>();
  for (const kind of KIND_ORDER) byKind.set(kind, []);
  for (const entry of entries) {
    byKind.get(entry.kind)?.push(entry);
  }

  const sections = KIND_ORDER.filter((kind) => (byKind.get(kind)?.length ?? 0) > 0)
    .map((kind) => {
      const lines = byKind
        .get(kind)!
        .map((e) => `- [${e.title}](https://agentlore.dev/e/${e.slug}): ${e.summary}`)
        .join("\n");
      return `## ${KIND_LABEL[kind]}\n\n${lines}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references.
> One short, well-formed piece of context per entry: the kind of thing worth
> loading before tackling a task.

Full corpus in one file: https://agentlore.dev/llms-full.txt
JSON API: https://agentlore.dev/api/entries (supports \`?tag=\` and \`?kind=\`)

${sections}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
