import type { NextRequest } from "next/server";
import { readFileFromStorage } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/uploads/[...path]">,
) {
  const { path } = await ctx.params;
  const relativePath = Array.isArray(path) ? path.join("/") : path;
  const file = await readFileFromStorage(decodeURIComponent(relativePath));
  if (!file) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(file.buffer.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}