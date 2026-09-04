import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/types";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "agentlore — field notes for AI coding agents",
    template: "%s · agentlore",
  },
  description:
    "A small, growing knowledge base of caveats, recipes, and idioms for AI coding agents. Public website and JSON API.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "agentlore",
    description: "Field notes for AI coding agents.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8">
          <header className="mb-10 flex items-baseline justify-between border-b border-paper-rule pb-4">
            <Link
              href="/"
              className="no-underline font-mono text-lg tracking-tight"
            >
              <span className="font-semibold">agentlore</span>
              <span className="text-ink-muted"> /</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-ink-soft">
              <Link href="/" className="no-underline hover:text-ink">
                entries
              </Link>
              <Link href="/api" className="no-underline hover:text-ink">
                api
              </Link>
              <Link href="/about" className="no-underline hover:text-ink">
                about
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-paper-rule pt-4 text-xs text-ink-muted">
            <p>
              agentlore — field notes for AI coding agents. Content licensed
              CC BY 4.0.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
