# agentlore

> Field notes for AI coding agents — a public website and JSON API of caveats,
> recipes, idioms, and references.

Each entry is one small, well-formed piece of context: the kind of thing worth
loading before tackling a task. The corpus grows one entry at a time.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Markdown content in `content/entries/`, parsed with [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and rendered with [`remark`](https://github.com/remarkjs/remark) + `remark-gfm`
- Deploys to any Node host; suited to Vercel.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run typecheck # tsc --noEmit
```

## Adding an entry

```bash
npm run new -- my-slug --kind caveat
```

Edit the generated file in `content/entries/`. Frontmatter fields:

| field      | type        | notes                                                  |
| ---------- | ----------- | ------------------------------------------------------ |
| `title`    | string      | required                                               |
| `slug`     | string      | URL slug; defaults to filename                         |
| `summary`  | string      | one-line description                                   |
| `kind`     | enum        | `caveat \| recipe \| idiom \| reference \| note`       |
| `tags`     | string[]    | lowercase, kebab-case                                  |
| `created`  | YYYY-MM-DD  |                                                        |
| `updated`  | YYYY-MM-DD  |                                                        |
| `related`  | string[]    | other slugs                                            |
| `source`   | string?     | optional authoritative URL                             |

## API

| method | path                       | description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/api/entries`             | list metadata, supports `?tag=` and `?kind=` |
| GET    | `/api/entries/{slug}`      | single entry, with rendered HTML             |
| GET    | `/api/search?q=...`        | token-AND substring search                   |
| GET    | `/api/tags`                | tags with counts                             |
| GET    | `/llms.txt`                | plain-text index, grouped by kind, for LLM context loading |
| GET    | `/llms-full.txt`           | every entry's raw markdown, concatenated for bulk ingestion |

All responses send `Access-Control-Allow-Origin: *`.

## License

- **Code:** MIT.
- **Content** (`content/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
