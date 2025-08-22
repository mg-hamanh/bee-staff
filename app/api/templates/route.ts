import prisma from "@/lib/prisma";
import { PayRateTemplateSchema } from "@/lib/zod/schema";
import { NextRequest, NextResponse } from "next/server";


// --- GET ALL TEMPLATES ---
export async function GET(req: NextRequest) {
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
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}


// --- POST NEW TEMPLATE ---
// export async function POST(req: Request) {
//   const body = await req.json();

//   const template = await prisma.payRateTemplate.create({
//     data: {
//       name: body.name,
//       bonusTemplates: {
//         create: body.bonusTemplates?.map((bt: any) => ({
//           type: bt.type,
//           mode: bt.mode,
//           description: bt.description,
//           status: bt.status ?? false,
//           bonusLevels: {
//             create: bt.bonusLevels?.map((bl: any) => ({
//               amount: bl.amount,
//               unit: bl.unit,
//               bonus: bl.bonus,
//             })) || [],
//           },
//         })),
//       },
//     },
//     include: {
//       bonusTemplates: {
//         include: {
//           bonusLevels: true,
//         },
//       },
//       users: true,
//     },
//   });

//   return NextResponse.json({
//     ...template,
//     totalUser: template.users.length,
//   });
// }



export async function POST(req: Request) {
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
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
