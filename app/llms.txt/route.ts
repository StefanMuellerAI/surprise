import { llmsIndex, TEXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsIndex(), { headers: TEXT_HEADERS });
}
