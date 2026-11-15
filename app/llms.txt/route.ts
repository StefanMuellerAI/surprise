import { buildLlmsIndex, TEXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsIndex(), { headers: TEXT_HEADERS });
}
