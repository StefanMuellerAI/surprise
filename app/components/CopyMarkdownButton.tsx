"use client";

import { useState } from "react";

interface Props {
  markdown: string;
}

export default function CopyMarkdownButton({ markdown }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy entry as Markdown"
      className={[
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-xs transition-colors",
        state === "copied"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : state === "error"
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-paper-rule bg-paper-card text-ink-muted hover:border-ink hover:text-ink",
      ].join(" ")}
    >
      {state === "copied" ? "✓ copied" : state === "error" ? "✗ failed" : "copy md"}
    </button>
  );
}
