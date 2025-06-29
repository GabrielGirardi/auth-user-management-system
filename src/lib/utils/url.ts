import { NextRequest } from "next/server";

export function getRouteParam(request: NextRequest): string | null {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  return parts.at(-1) ?? null;
}