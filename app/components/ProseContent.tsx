"use client";
import { useEffect, useRef } from "react";

export function ProseContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.textContent = "copy";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");

      btn.addEventListener("click", () => {
        const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "copied!";
          btn.classList.add("copy-btn--done");
          setTimeout(() => {
            btn.textContent = "copy";
            btn.classList.remove("copy-btn--done");
          }, 1500);
        });
      });

      pre.appendChild(btn);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose-lore"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
