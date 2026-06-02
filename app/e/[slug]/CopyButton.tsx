"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";

function formatForAgent(entry: Entry): string {
  const lines: string[] = [];
  lines.push(`# ${entry.title}`);
  lines.push("");
  if (entry.summary) {
    lines.push(`> ${entry.summary}`);
    lines.push("");
  }
  const meta = [`kind: ${entry.kind}`, `slug: ${entry.slug}`];
  if (entry.tags.length > 0) meta.push(`tags: ${entry.tags.join(", ")}`);
  if (entry.source) meta.push(`source: ${entry.source}`);
  lines.push(meta.join(" | "));
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(entry.body);
  return lines.join("\n");
}

export function CopyButton({ entry }: { entry: Entry }) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function handleClick() {
    await navigator.clipboard.writeText(formatForAgent(entry));
    setState("copied");
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="chip transition-colors"
      title="Copy entry as markdown — ready to paste into an agent's context"
    >
      {state === "copied" ? "✓ copied" : "copy for agent"}
    </button>
  );
}
