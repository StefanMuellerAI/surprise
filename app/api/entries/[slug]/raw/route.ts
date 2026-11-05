import { getEntry } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) {
    return new Response("Not found\n", { status: 404 });
  }
  const text = `# ${entry.title}\n\n${entry.summary ? `> ${entry.summary}\n\n` : ""}${entry.body}\n`;
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function generateStaticParams() {
  return [];
}
