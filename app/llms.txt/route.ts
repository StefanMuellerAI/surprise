import { buildLlmsTxt, textResponse } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return textResponse(buildLlmsTxt());
}
