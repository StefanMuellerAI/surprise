#!/usr/bin/env node
// Scaffold a new agentlore entry.
//   node scripts/new-entry.mjs <slug> [--kind caveat|recipe|idiom|reference|note]
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith("--")) {
  console.error("usage: node scripts/new-entry.mjs <slug> [--kind <kind>]");
  process.exit(1);
}

const slug = args[0]
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-+|-+$/g, "");

const kindIdx = args.indexOf("--kind");
const kind = kindIdx >= 0 ? args[kindIdx + 1] : "note";

const today = new Date().toISOString().slice(0, 10);
const dir = path.join(process.cwd(), "content", "entries");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`refusing to overwrite ${file}`);
  process.exit(1);
}

const template = `---
title: ""
slug: "${slug}"
summary: ""
kind: "${kind}"
tags: []
created: "${today}"
updated: "${today}"
related: []
---

`;

fs.writeFileSync(file, template);
console.log(`created ${path.relative(process.cwd(), file)}`);
