import { llmsFull, TEXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFull(), { headers: TEXT_HEADERS });
}
