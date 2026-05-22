import { NextResponse } from "next/server";
import { getAllTags } from "@/lib/entries";

export const dynamic = "force-static";

export async function GET() {
  const tags = getAllTags();
  return NextResponse.json(
    { count: tags.length, tags },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}
