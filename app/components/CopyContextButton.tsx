"use client";

import { useState } from "react";

export function CopyContextButton() {
  const [state, setState] = useState<"idle" | "copying" | "done" | "error">("idle");

  async function handleClick() {
    setState("copying");
    try {
      const res = await fetch("/api/context");
      if (!res.ok) throw new Error("fetch failed");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  const label =
    state === "copying"
      ? "copying…"
      : state === "done"
        ? "copied!"
        : state === "error"
          ? "failed"
          : "copy as context";

  return (
    <button
      onClick={handleClick}
      disabled={state === "copying"}
      className="chip text-xs disabled:opacity-50"
      title="Copy all entries as a single markdown document for pasting into a system prompt"
    >
      {label}
    </button>
  );
}
