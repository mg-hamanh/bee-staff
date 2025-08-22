import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // prisma client của bạn
import { Prisma } from "@/lib/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || undefined;
    const roleName = searchParams.get("roleName") || undefined;
    const depotId = searchParams.get("depotId") ? parseInt(searchParams.get("depotId")!) : undefined;

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "30");

    

    const where: Prisma.UserWhereInput = {
        OR: q
        ? [
            { name: { contains: q, mode: "insensitive"}},
            { email: { contains: q, mode: "insensitive"}},
        ]
        : undefined,
  roleName: roleName || undefined,
  depots: depotId ? { has: depotId } : undefined,
        };

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    
    

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newUser = await prisma.user.create({
      data: {
        id: uuid(),
        username: body.username,
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        roleName: body.roleName,
        depots: body.depots || [],
        roleId: body.roleId,
        isAdmin: body.isAdmin || false,
        payRateId: body.payRateId || null,
        image: body.image || null,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
function uuid(): any {
    throw new Error("Function not implemented.");
}

