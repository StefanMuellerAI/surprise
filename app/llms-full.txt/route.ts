import { buildLlmsFull, TEXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFull(), { headers: TEXT_HEADERS });
}
