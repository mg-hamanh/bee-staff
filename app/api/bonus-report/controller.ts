import prisma from "../../../lib/prisma";
import { CompareRange } from "@/utils/formatters";
import { BonusReport } from "@/types/type-ui";

export async function fetchBonusReport(params: {
  userId?: number;
  date: CompareRange;
}): Promise<BonusReport[]> {
  const { current, previous } = params.date;

  // 1. Lấy invoices + invoice_details
  const invoices = await prisma.invoice.findMany({
    where: {
      date: {
        gte: new Date(previous.startDate),
        lte: new Date(current.endDate),
      },
      saleId: params.userId ? Number(params.userId) : undefined,
      mode: { in: [1, 2] },
      isDeleted: false,
    },
    include: {
      invoice_details: true,
    },
  });

  // 2. Gom dữ liệu invoice_data
  const invoiceData = invoices.flatMap((inv) =>
    inv.invoice_details.map((idt) => {
      const period =
        inv.date && inv.date >= new Date(current.startDate) ? "current" : "last";
      return {
        invoiceId: inv.id.toString(),
        saleId: inv.saleId?.toString() ?? "0",
        date: inv.date,
        type: inv.type,
        quantity: Number(idt.quantity),
        money: Number(idt.money),
        period,
      };
    })
  );

  // 3. Tính invoice_quantity
  const invoiceQuantityMap = new Map<string, number>();
  invoiceData.forEach((row) => {
    const prev = invoiceQuantityMap.get(row.invoiceId) ?? 0;
    const qty = row.type === 2 ? row.quantity : -row.quantity;
    invoiceQuantityMap.set(row.invoiceId, prev + qty);
  });

  // 4. Tính metrics theo sale_id
  const metricsMap = new Map<
    string,
    {
      current: {
        invoices: Set<string>;
        validInvoices: Set<string>;
        products: number;
        revenues: number;
      };
      last: {
        invoices: Set<string>;
        validInvoices: Set<string>;
        products: number;
        revenues: number;
      };
    }
  >();

  invoiceData.forEach((row) => {
    const m =
      metricsMap.get(row.saleId) ??
      {
        current: {
          invoices: new Set<string>(),
          validInvoices: new Set<string>(),
          products: 0,
          revenues: 0,
        },
        last: {
          invoices: new Set<string>(),
          validInvoices: new Set<string>(),
          products: 0,
          revenues: 0,
        },
      };

    const target = row.period === "current" ? m.current : m.last;
    target.invoices.add(row.invoiceId);

    const qty = row.type === 2 ? row.quantity : -row.quantity;
    const money = row.type === 2 ? row.money : -row.money;
    target.products += qty;
    target.revenues += money;

    if ((invoiceQuantityMap.get(row.invoiceId) ?? 0) >= 2) {
      target.validInvoices.add(row.invoiceId);
    }

    metricsMap.set(row.saleId, m);
  });

  // 5. Lấy thông tin user
  const userIds = Array.from(metricsMap.keys()).map((id) => String(id));
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      // name: { not: { contains: "bee", mode: "insensitive" } },
    },
    include: {
      payRateTemplate: {
        include: { bonusTemplates: {
          include: { bonusLevels: true}
        } },
      },
    },
  });

  // 6. Tính toán final report
  const reports: BonusReport[] = users.map((u) => {
    const m = metricsMap.get(u.id.toString())!;

    const currentTotalInvoices = m.current.invoices.size;
    const lastTotalInvoices = m.last.invoices.size;
    const currentValidInvoices = m.current.validInvoices.size;
    const lastValidInvoices = m.last.validInvoices.size;
    const currentTotalProducts = m.current.products;
    const lastTotalProducts = m.last.products;
    const currentTotalRevenues = m.current.revenues;
    const lastTotalRevenues = m.last.revenues;

    const growth = (curr: number, last: number) =>
      last === 0 ? null : Number(((curr - last) * 100 / last).toFixed(2));

    const growthInvoicesPercent = growth(
      currentTotalInvoices,
      lastTotalInvoices
    );
    const growthValidInvoicesPercent = growth(
      currentValidInvoices,
      lastValidInvoices
    );
    const growthProductsPercent = growth(
      currentTotalProducts,
      lastTotalProducts
    );
    const growthRevenuesPercent = growth(
      currentTotalRevenues,
      lastTotalRevenues
    );

    // 7. Bonus calculation
    const levels =
      u.payRateTemplate?.bonusTemplates?.flatMap((t) => t.bonusLevels) ?? [];
    levels.sort((a, b) => (Number(a.amount) ?? 0) - (Number(b.amount) ?? 0));

    const minTargetAmount = Number(levels[0]?.amount) ?? 0;
    const targetPercent = minTargetAmount
      ? Number(((currentTotalRevenues * 100) / minTargetAmount).toFixed(2))
      : null;

    let currentTargetAmount: number | null = null;
    let currentBonus: number | null = null;
    let nextTargetAmount: number | null = null;
    let nextBonus: number | null = null;

    for (const lvl of levels) {
      if (currentTotalRevenues >= Number(lvl.amount)) {
        currentTargetAmount = Number(lvl.amount);
        currentBonus = Math.ceil((Number(lvl.bonus) * currentTotalRevenues) / 100);
      } else if (nextTargetAmount === null) {
        nextTargetAmount = Number(lvl.amount) - currentTotalRevenues;
        nextBonus = Math.ceil((Number(lvl.bonus) * Number(lvl.amount)) / 100);
      }
    }

    return {
      saleId: u.id.toString(),
      name: u.name ?? "",

      currentTotalInvoices,
      lastTotalInvoices,
      currentValidInvoices,
      lastValidInvoices,
      currentTotalProducts,
      lastTotalProducts,
      currentTotalRevenues,
      lastTotalRevenues,

      growthInvoicesPercent,
      growthValidInvoicesPercent,
      growthProductsPercent,
      growthRevenuesPercent,

      minTargetAmount,
      targetPercent,
      currentTargetAmount,
      currentBonus,
      nextTargetAmount,
      nextBonus,
    };
  });

  return reports;
}
