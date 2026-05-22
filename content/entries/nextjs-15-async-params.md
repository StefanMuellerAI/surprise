---
title: "Next.js 15: route params and searchParams are now async"
slug: "nextjs-15-async-params"
summary: "In Next.js 15 the params and searchParams props on pages, layouts, and route handlers are Promises — you must await them."
kind: "caveat"
tags: ["nextjs", "react", "breaking-change", "v15", "app-router"]
created: "2026-05-22"
updated: "2026-05-22"
related: []
source: "https://nextjs.org/docs/app/guides/upgrading/version-15"
---

In **Next.js 15** the dynamic route props passed to **pages**, **layouts**, and
**route handlers** in the App Router became asynchronous. Cookies, headers, and
`draftMode()` from `next/headers` became asynchronous in the same release.

## Wrong (Next.js 14 style, breaks in 15)

```tsx
// app/posts/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>; // ❌ params is a Promise in v15
}
```

## Right

```tsx
// app/posts/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

The same applies to `searchParams`, to layouts, to `generateMetadata`, and to
route handlers (`GET(_req, ctx: { params: Promise<{ slug: string }> })`).

## In a client component

Client components can't be `async`. Unwrap the Promise with React's `use()`:

```tsx
"use client";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <h1>{slug}</h1>;
}
```

## Why

The change lets Next.js render the static parts of a route before the dynamic
inputs resolve, improving streaming behaviour. The `next-codemod next-async-request-api`
codemod will rewrite most call sites automatically.
