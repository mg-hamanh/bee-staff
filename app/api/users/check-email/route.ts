import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// /api/users/check-email?email=xxx
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ exists: false });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return NextResponse.json({ exists: !!user });
}
