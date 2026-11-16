import { buildLlmsTxt, TEXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), { headers: TEXT_HEADERS });
}
