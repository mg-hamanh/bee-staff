import prisma from "@/lib/prisma";

export async function findUserDepots(depotIds?: number[] | null) {
  if (!depotIds || depotIds.length === 0) {
    // trả về tất cả depots
    return await prisma.depot.findMany();
  }

  return await prisma.depot.findMany({
    where: {
      id: { in: depotIds },
    },
  });
}

type PrismaModels = keyof typeof prisma;

export async function generateCode(
  modelName: PrismaModels,
  field: string,
  prefix: string,
  length = 6
) {
  const model = (prisma as any)[modelName]; // dynamic access

  if (!model) {
    throw new Error(`Model không tồn tại trong Prisma Client`);
  }

  // 1. Lấy record mới nhất theo code (desc)
  const lastRecord = await model.findFirst({
    where: {
      [field]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [field]: "desc",
    },
  });

  // 2. Nếu chưa có record nào thì bắt đầu từ 1
  let nextNumber = 1;

  if (lastRecord?.[field]) {
    const numberPart = (lastRecord[field] as string).replace(prefix, "");
    nextNumber = parseInt(numberPart, 10) + 1;
  }

  // 3. Format lại
  const newCode = `${prefix}${String(nextNumber).padStart(length, "0")}`;

  return newCode;
}