import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserSchema } from "@/types/type-zod";
import { requireAdmin } from "@/lib/auth/guard";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = UserSchema.parse(body);

    // phải await params
    const { id } = await params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: parsed.username,
        name: parsed.name || '',
        email: parsed.email,
        mobile: parsed.mobile,
        depots: parsed.depots,
        image: parsed.image,
        role: parsed.role,
        isActive: parsed.isActive,
        payRateId: body.payRateId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }>}) {
  const { error, session } = await requireAdmin(req);
  if (error) return error;
  const { id } = await context.params;
  
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
