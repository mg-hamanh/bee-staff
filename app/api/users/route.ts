import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // prisma client của bạn
import { UserSchema } from "@/types/type-zod";
import { requireAdmin, requireAuth } from "@/lib/auth/guard";


export async function GET(req: NextRequest) {
  try {
    const { error, session, depotFilter } = await requireAuth(req, {
      roles: ["leader"],       // seller/cashier không được xem list user
      restrictByDepot: true,   // leader chỉ được xem theo depot
    });

    if (error) return error;

    let users: any[] = [];

    if (session!.user.isAdmin) {
      // Admin => thấy tất cả
      users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else if (session!.user.role === "leader") {
      // Leader => chỉ xem users thuộc depot mình quản lý
      users = await prisma.user.findMany({
        where: {
          depots: { hasSome: depotFilter }, // depotFilter trả ra từ requireAuth
          isAdmin: false, // bỏ admin
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // seller / cashier => chặn bởi requireAuth rồi
      users = [];
    }

    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  // ✅ chỉ cho admin
  const { error, session } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = UserSchema.parse(body);

    const newUser = await prisma.user.create({
      data: {
        username: parsed.username,
        name: parsed.name || "",
        email: parsed.email,
        mobile: parsed.mobile,
        depots: parsed.depots || [],
        image: parsed.image,
        role: parsed.role,
        isActive: parsed.isActive,
        payRateId: body.payRateId || null,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
