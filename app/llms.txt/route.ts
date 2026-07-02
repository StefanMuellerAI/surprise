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
  const baseUrl = "https://agentlore.dev";

  const sections = KIND_ORDER.filter((kind) =>
    entries.some((e) => e.kind === kind),
  )
    .map((kind) => {
      const lines = entries
        .filter((e) => e.kind === kind)
        .map(
          (e) =>
            `- [${e.title}](${baseUrl}/api/entries/${e.slug}): ${e.summary}`,
        )
        .join("\n");
      return `## ${KIND_LABEL[kind]}\n\n${lines}`;
    })
    .join("\n\n");

  const body = `# agentlore

> Field notes for AI coding agents — caveats, recipes, idioms, and references,
> written to be loaded as context before a task.

Each link resolves to a JSON entry with the raw Markdown body and rendered
HTML. Fetch the whole corpus at once with \`GET ${baseUrl}/api/entries\`,
filter with \`?tag=\` or \`?kind=\`, or search with
\`GET ${baseUrl}/api/search?q=\`.

${sections}

## API

- [List entries](${baseUrl}/api/entries): all entries as metadata JSON, supports \`?tag=\` and \`?kind=\`
- [Search](${baseUrl}/api/search?q=): token-AND substring search across title, summary, tags, body
- [Tags](${baseUrl}/api/tags): tags with usage counts

Content is CC BY 4.0. Code is MIT.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
