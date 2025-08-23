import { requireAdmin } from "@/lib/auth/guard";
import prisma from "@/lib/prisma";
import { PayRateTemplateSchema } from "@/types/type-zod";
import { NextRequest, NextResponse } from "next/server";


// --- GET ALL TEMPLATES ---
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
    if (error) return error;
  try {
    const templates = await prisma.payRateTemplate.findMany({
      include: {
        bonusTemplates: {
          include: { bonusLevels: true },
        },
        users: true,
      },
      orderBy: { name: "asc" }, // sắp xếp cho đẹp, tuỳ anh
    });

    const result = templates.map((t) => ({
      ...t,
      totalUser: t.users.length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
    if (error) return error;

  try {
    const body = await req.json();

    // Validate body
    const parsed = PayRateTemplateSchema.parse(body);

    const template = await prisma.payRateTemplate.create({
      data: {
        name: parsed.name,
        bonusTemplates: {
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
              })) || [],
            },
          })),
        },
      },
      include: {
        bonusTemplates: {
          include: {
            bonusLevels: true,
          },
        },
        users: true,
      },
    });

    return NextResponse.json({
      ...template,
      totalUser: template.users.length,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
