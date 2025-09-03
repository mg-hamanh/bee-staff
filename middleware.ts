// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// It's a good practice to define this object outside the middleware function
// for clarity and potential reuse.
const requiredRoles: { [key: string]: {
  roles?: string[];
  status?: "active" | "inactive" | "future";
} } = {
  "/sign-in": { roles: [] },
  "/man/Dashboard": { roles: [] },

  "/man/Employee": { roles: ["admin", "leader"] },
  "/man/Paysheet": { roles: ["admin", "leader"] },
  
  "/man/EmployerSetting": { roles: ["admin"] },
  
  "/man/WeeklyReport": { roles: ["admin", "leader"], status: "future" },
};

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const url = new URL(request.url);
  const path = url.pathname;

  const isApiRoute = path.startsWith("/api/");

   if (isApiRoute) {
    return NextResponse.next();
  }
  
  const routeConfig = requiredRoles[path];
  const userRole = session?.user?.role;
  const isAdmin = session?.user?.isAdmin;
  const isAuthenticated = !!session;

  // Nếu path không được định nghĩa, redirect nếu đã xác thực
  if (typeof routeConfig === 'undefined') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/man/Dashboard", request.url));
    }
  }

  // Xử lý các đường dẫn công khai và các trường hợp đặc biệt
  if (routeConfig) {
      // Trường hợp 1: Route không hoạt động hoặc chưa ra mắt
      if (routeConfig.status === "inactive" || routeConfig.status === "future") {
        const refererUrl = request.headers.get('referer');
          const redirectUrl = new URL(refererUrl || "/man/Dashboard", request.url);
          redirectUrl.searchParams.set("error", routeConfig.status);
          return NextResponse.redirect(redirectUrl);
      }
      
      // Trường hợp 2: Route công khai (roles trống)
      if (routeConfig.roles?.length === 0) {
          if (!isAuthenticated && path !== "/sign-in") {
              return NextResponse.redirect(new URL("/sign-in", request.url));
          }
          return NextResponse.next();
      }

      // Trường hợp 3: Route yêu cầu vai trò
      if (Array.isArray(routeConfig.roles) && routeConfig.roles.length > 0) {
          if (!isAuthenticated) {
              return NextResponse.redirect(new URL("/sign-in", request.url));
          }

          if (isAdmin || (typeof userRole === "string" && routeConfig.roles.includes(userRole))) {
              return NextResponse.next();
          } else {
              const redirectUrl = new URL("/man/Dashboard", request.url);
              redirectUrl.searchParams.set("error", "access_denied");
              return NextResponse.redirect(redirectUrl);
          }
      }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)"],
};