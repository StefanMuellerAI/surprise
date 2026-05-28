"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value.trim();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q) {
          params.set("q", q);
        } else {
          params.delete("q");
        }
        router.replace(`/?${params.toString()}`, { scroll: false });
      }, 200);
    },
    [router, searchParams],
  );

  return (
    <input
      type="search"
      placeholder="Search entries…"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="w-full rounded-md border border-paper-rule bg-paper-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
    />
  );
}
