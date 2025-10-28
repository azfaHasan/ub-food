import { auth } from "@/auth";
import { NextResponse } from "next/server";

function setNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;
  const role = session?.user?.role || "";

  // Sudah Login
  if (session) {
  	if (pathname === "/login") {
  	  let redirectUrl = "/";
  	  if (role === "PENJUAL") redirectUrl = "/penjual";
  	  if (role === "ADMIN") redirectUrl = "/admin";

      const response = NextResponse.redirect(new URL(redirectUrl, req.url));
  	  return setNoCacheHeaders(response);
  	}

  	if (pathname === "/" && (role === "ADMIN" || role === "PENJUAL")) {
  	  const redirectUrl = role === "ADMIN" ? "/admin" : "/penjual";

      const response = NextResponse.redirect(new URL(redirectUrl, req.url));
  	  return setNoCacheHeaders(response);
  	}

  	  return setNoCacheHeaders(NextResponse.next());
  }

  // Belum Login
  if (!session) {
  	const isProtectedRoute =
  	  pathname.startsWith("/admin") ||
  	  pathname.startsWith("/penjual") ||
        pathname.startsWith("/user");

  	if (isProtectedRoute) {
      const response = NextResponse.redirect(new URL("/login", req.url));
  	  return setNoCacheHeaders(response);
  	}

  	return setNoCacheHeaders(NextResponse.next());
  }
});

export const config = {
  matcher: [
  	"/",
  	"/login",
  	"/admin/:path*",
  	"/penjual/:path*",
  ],
};