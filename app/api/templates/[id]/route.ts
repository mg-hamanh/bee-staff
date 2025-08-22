import prisma from "@/lib/prisma";
import { PayRateTemplateSchema } from "@/lib/zod/schema";
import { NextResponse } from "next/server";

// --- PUT TEMPLATE ---
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // ✅ Validate với zod
    const parsed = PayRateTemplateSchema.partial().parse(body);

    const { id } = params;
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
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: error.message ?? "Không thể cập nhật mẫu" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request, context: { params: Promise<{ id: string }>}) {
  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.payRateTemplate.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
