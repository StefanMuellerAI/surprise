"use client";

import { useState } from "react";

export function CopyButton({ markdown }: { markdown: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setState("copied");
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      onClick={copy}
      title="Copy entry as Markdown — ready to paste into an agent"
      className="inline-flex items-center gap-1.5 rounded border border-paper-rule bg-paper-card px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      {state === "copied" ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="4" y="1" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 4h3M1 7h3M8 1V0H1a1 1 0 00-1 1v8h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          copy for agent
        </>
      )}
    </button>
  );
}
