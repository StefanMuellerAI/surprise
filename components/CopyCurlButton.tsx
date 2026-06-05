"use client";

import { useState } from "react";

export function CopyCurlButton({ apiPath }: { apiPath: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const cmd = `curl ${window.location.origin}${apiPath}`;
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center rounded-sm border border-paper-rule px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      {copied ? "copied ✓" : "copy curl"}
    </button>
  );
}
