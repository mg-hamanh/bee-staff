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
