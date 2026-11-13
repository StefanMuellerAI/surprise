import { NextResponse } from "next/server";

export const dynamic = "force-static";

const KINDS = ["caveat", "recipe", "idiom", "reference", "note"];

const entryMeta = {
  type: "object",
  required: [
    "slug",
    "title",
    "summary",
    "kind",
    "tags",
    "created",
    "updated",
    "related",
  ],
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    summary: { type: "string" },
    kind: { type: "string", enum: KINDS },
    tags: { type: "array", items: { type: "string" } },
    created: { type: "string", format: "date" },
    updated: { type: "string", format: "date" },
    related: {
      type: "array",
      items: { type: "string" },
      description: "Slugs of related entries.",
    },
    source: {
      type: "string",
      format: "uri",
      description: "Authoritative source, when there is one.",
    },
  },
};

const json = (schema: object) => ({
  "application/json": { schema },
});

const SPEC = {
  openapi: "3.1.0",
  info: {
    title: "agentlore API",
    version: "0.1.0",
    description:
      "Field notes for AI coding agents: caveats, recipes, idioms and references. Read-only, no authentication, CORS open.",
    license: {
      name: "CC BY 4.0 (content)",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/entries": {
      get: {
        operationId: "listEntries",
        summary: "List entries (metadata only), newest first.",
        parameters: [
          {
            name: "tag",
            in: "query",
            description: "Only entries carrying this exact tag.",
            schema: { type: "string" },
          },
          {
            name: "kind",
            in: "query",
            description: "Only entries of this kind.",
            schema: { type: "string", enum: KINDS },
          },
        ],
        responses: {
          "200": {
            description: "Matching entries.",
            content: json({
              type: "object",
              required: ["count", "entries"],
              properties: {
                count: { type: "integer" },
                entries: {
                  type: "array",
                  items: { $ref: "#/components/schemas/EntryMeta" },
                },
              },
            }),
          },
        },
      },
    },
    "/api/entries/{slug}": {
      get: {
        operationId: "getEntry",
        summary: "Fetch one entry with its Markdown body and rendered HTML.",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The entry.",
            content: json({ $ref: "#/components/schemas/Entry" }),
          },
          "404": {
            description: "No entry with that slug.",
            content: json({
              type: "object",
              required: ["error", "slug"],
              properties: {
                error: { type: "string", const: "not_found" },
                slug: { type: "string" },
              },
            }),
          },
        },
      },
    },
    "/api/search": {
      get: {
        operationId: "searchEntries",
        summary:
          "Search title, summary, tags and body. Every whitespace-separated token must match (case-insensitive substring).",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search terms.",
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 25 },
          },
        ],
        responses: {
          "200": {
            description: "Matches, best first. Metadata only.",
            content: json({
              type: "object",
              required: ["query", "count", "results"],
              properties: {
                query: { type: "string" },
                count: { type: "integer" },
                results: {
                  type: "array",
                  items: { $ref: "#/components/schemas/EntryMeta" },
                },
              },
            }),
          },
        },
      },
    },
    "/api/tags": {
      get: {
        operationId: "listTags",
        summary: "List all tags with usage counts, most used first.",
        responses: {
          "200": {
            description: "Tags.",
            content: json({
              type: "object",
              required: ["count", "tags"],
              properties: {
                count: { type: "integer" },
                tags: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["tag", "count"],
                    properties: {
                      tag: { type: "string" },
                      count: { type: "integer" },
                    },
                  },
                },
              },
            }),
          },
        },
      },
    },
  },
  components: {
    schemas: {
      EntryMeta: entryMeta,
      Entry: {
        allOf: [
          { $ref: "#/components/schemas/EntryMeta" },
          {
            type: "object",
            required: ["body", "html"],
            properties: {
              body: { type: "string", description: "Raw Markdown." },
              html: { type: "string", description: "Rendered HTML." },
            },
          },
        ],
      },
    },
  },
};

export function GET() {
  return NextResponse.json(SPEC, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
