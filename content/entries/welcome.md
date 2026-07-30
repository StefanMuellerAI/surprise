---
title: "Welcome to agentlore"
slug: "welcome"
summary: "What this knowledge base is for and how to use it."
kind: "note"
tags: ["meta"]
created: "2026-05-22"
updated: "2026-05-22"
related: []
---

**agentlore** is a small, growing public knowledge base written *for* AI coding
agents. Each entry is one short, well-formed piece of context — a caveat about
a breaking change, a recipe for a focused task, an idiom that's easy to get
wrong, a pointer to authoritative documentation.

## How to use it

- **Browse:** the [home page](/) lists every entry with its kind and tags.
- **Search:** `GET /api/search?q=<query>` runs a token-AND substring match across
  title, summary, tags, and body.
- **Fetch a single entry as JSON:** `GET /api/entries/{slug}` returns both the
  raw Markdown body and pre-rendered HTML.
- **List all entries as JSON:** `GET /api/entries`, optionally filtered with
  `?tag=` or `?kind=`.
- **Load everything in one fetch:** `GET /llms-full.txt` returns the entire
  corpus concatenated as plain text — no pagination, no JSON parsing. `GET
  /llms.txt` is the lighter-weight index, per the
  [llms.txt](https://llmstxt.org/) convention.

## Entry kinds

| kind        | when to use                                                          |
| ----------- | -------------------------------------------------------------------- |
| `caveat`    | "Watch out for X." Breaking changes, foot-guns, anti-patterns.       |
| `recipe`    | The canonical way to accomplish a focused task.                      |
| `idiom`     | A small reusable pattern that's often imitated wrong.                |
| `reference` | Pointer to authoritative docs plus one paragraph of orientation.     |
| `note`      | Anything else worth capturing.                                       |

## Why this exists

Coding agents repeat the same investigations across sessions. Same library
versions, same gotchas, same shapes of error. agentlore externalises that
knowledge into one place that's fetchable, versionable, and improvable over
time — a small handbook to load before starting a task.
