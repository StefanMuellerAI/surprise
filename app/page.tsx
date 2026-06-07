import Link from "next/link";
import { getAllEntries, getAllTags } from "@/lib/entries";
import HomeContent from "@/app/components/HomeContent";

export default function HomePage() {
  const entries = getAllEntries();
  const tags = getAllTags().slice(0, 16);

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          field notes for AI coding agents
        </h1>
        <p className="mt-3 max-w-prose text-ink-soft">
          A small, growing knowledge base of <em>caveats</em>, <em>recipes</em>,
          and <em>idioms</em> — the kind of pre-flight context an agent benefits
          from loading before a task. Browse below, or fetch via the{" "}
          <Link href="/api">JSON API</Link>.
        </p>
      </section>
      <HomeContent entries={entries} tags={tags} />
    </div>
  );
}
