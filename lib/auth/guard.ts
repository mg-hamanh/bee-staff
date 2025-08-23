// lib/auth-utils.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface RequireAuthOptions {
  roles?: Array<"seller" | "cashier" | "leader">; // admin bỏ qua check này
  restrictByDepot?: boolean; // chỉ áp dụng khi role = leader
}

export async function requireAuth(
  req: NextRequest,
  options: RequireAuthOptions = {}
) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || !session.user.isActive) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Nếu admin thì bỏ qua tất cả check
  if (session.user.isAdmin) {
    return { session };
  }

  // Check role
  if (options.roles && (!session.user.role || !options.roles.includes(session.user.role))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  // Nếu là leader và restrictByDepot thì thêm filter depot
  let depotFilter: number[] | undefined;
  if (options.restrictByDepot && session.user.role === "leader") {
    depotFilter = session.user.depots;
  }

  return { session, depotFilter };
}


export async function requireAdmin(req: NextRequest) {
  const { error, session } = await requireAuth(req);
  if (error) return { error };

  if (!session!.user.isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}