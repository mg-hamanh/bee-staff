import { requireAdmin } from "@/lib/auth/guard";
import prisma from "@/lib/prisma";
import { PayRateTemplateSchema } from "@/types/type-zod";
import { NextRequest, NextResponse } from "next/server";

// --- PUT TEMPLATE ---
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(req);
    if (error) return error;

  try {
    const body = await req.json();
    const parsed = PayRateTemplateSchema.partial().parse(body);

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // ✅ Update template
    const updated = await prisma.payRateTemplate.update({
      where: { id },
      data: {
        name: parsed.name ?? undefined,
        bonusTemplates: {
          deleteMany: {}, // Xoá hết bonusTemplates cũ
          create: parsed.bonusTemplates?.map((bt) => ({
            type: bt.type,
            mode: bt.mode,
            description: bt.description,
            status: bt.status ?? false,
            bonusLevels: {
              create: bt.bonusLevels?.map((bl) => ({
                amount: bl.amount,
                unit: bl.unit,
                bonus: bl.bonus,
              })) ?? [],
            },
          })),
        },
      },
      include: {
        bonusTemplates: { include: { bonusLevels: true } },
        users: true,
      },
    });

    return NextResponse.json({
      ...updated,
      totalUser: updated.users.length,
    });
  } catch (err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
}



export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }>}) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await context.params;

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.payRateTemplate.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
