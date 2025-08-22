import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id } = params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: body.username,
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        roleName: body.roleName,
        depots: body.depots,
        roleId: body.roleId,
        isAdmin: body.isAdmin,
        payRateId: body.payRateId,
        image: body.image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
