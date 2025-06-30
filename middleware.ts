import { type NextRequest, NextResponse } from "next/server";
import { decrypt, updateSession } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = ["/dashboard", "/profile", "/users"]
const publicRoutes = ["/login"];

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  const cookie = req.cookies.get("session")?.value;

  let session = null;
  let isExpired = false;


  if (cookie) {
    try {
      session = await decrypt(cookie as string);
      if (cookie) isExpired = isTokenExpired(cookie);
    } catch (e) {
      console.error("Erro ao decifrar token:", e);
      isExpired = true;
    }
  }

  if (isProtectedRoute && (!session?.user || isExpired)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && !["ADMIN", "VIEWER"].includes(session.user.role)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.user && !isExpired && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return await updateSession(req);
}

export const config = {
  matcher: ["/login", "/dashboard", "/dashboard/:path*", "/users", "/users/:path*", "/profile", "/profile/:path*"],
};
