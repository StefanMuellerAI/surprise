"use client";

import { useState } from "react";

export function CopyMarkdownButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-paper-rule px-2 py-0.5 font-mono text-xs text-ink-muted hover:text-ink"
    >
      {state === "done" ? "copied ✓" : state === "error" ? "copy failed" : "copy as markdown"}
    </button>
  );
}
