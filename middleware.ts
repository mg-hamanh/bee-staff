// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  

  const url = new URL(request.url);
  const path = url.pathname;

  // Paths that should always be publicly accessible
  const publicPaths = ["/sign-in", "/api/auth/callback/google", "/api/auth/sign-in/social"];

  // Check if the current path is one of the public paths
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  // If there's no session and the user is not on a public path, redirect them to sign-in
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If there is a session and the user tries to access /sign-in, redirect them to the home page
  if (session && path === "/sign-in") {
    return NextResponse.rewrite(new URL("/man", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except static, image, and favicon
};