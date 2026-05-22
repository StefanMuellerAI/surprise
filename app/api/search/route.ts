import { NextResponse } from "next/server";
import { searchEntries, toMeta } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(limitParam ?? "25", 10) || 25),
  );

  const results = q ? searchEntries(q, limit) : [];

  return NextResponse.json(
    {
      query: q,
      count: results.length,
      results: results.map(toMeta),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    },
  );
}
