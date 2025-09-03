// services/payrollService.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreatePaysheet } from "@/types/type-zod";
import { generateCode } from "@/utils/server";
import { BonusTemplate, BonusLevel, User } from "@prisma/client";
import dayjs from "dayjs";
import { headers } from "next/headers";

// Hàm chính được gọi bởi API route
export async function createBonusPaysheet(input: CreatePaysheet) {
  const { startTime, endTime, scope, employeeIds, periodName, periodId } = input;

  const session = await auth.api.getSession({
    headers: await headers()
  })

  const userId: string = session?.user.id || "no-user-id";

  // 1. Lấy danh sách nhân viên cần xử lý
  const employeesToProcess = await getEmployees(scope, employeeIds);

  // 2. Tạo bản ghi Paysheet tổng
  const newPaysheet = await createPaysheetRecord(userId, periodId, periodName, startTime, endTime, employeesToProcess.length);

  // 3. Vòng lặp tính thưởng và tạo Payslip cho từng nhân viên
  let totalBonusAggregated = 0;
  for (const employee of employeesToProcess) {
    const bonusData = await calculateEmployeeBonus(employee, startTime, endTime);
    await createPayslipRecord(newPaysheet.id, employee, bonusData.totalBonus);
      totalBonusAggregated += bonusData.totalBonus;

    // if (bonusData.totalBonus > 0) {
      
    // }
  }

  // 4. Cập nhật lại Paysheet với tổng tiền thưởng
  const updatedPaysheet = await updatePaysheetTotals(newPaysheet.id, totalBonusAggregated);

  return updatedPaysheet;
}

// ---- CÁC HÀM HỖ TRỢ ----

async function getEmployees(scope: 'all' | 'optional', employeeIds?: string[]) {
  if (scope === 'all') {
    return prisma.user.findMany({ where: { isActive: true } });
  }
  return prisma.user.findMany({
    where: { id: { in: employeeIds }, isActive: true },
  });
}

async function createPaysheetRecord(userId: string, periodId: string, periodName: string, startTime: string, endTime: string, employeeCount: number) {
    const code = await generateCode("paysheet", "code", "BL");
    const name =
  periodId === "2"
    ? "Bảng lương tùy chọn"
    : `Bảng lương tháng ${dayjs(startTime).format("M/YYYY")}`;


  return prisma.paysheet.create({
    data: {
      code,
      name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      periodId: Number(periodId),
      periodName,
      workingDayNumber: 0, // Sẽ phát triển sau
      employeeTotal: employeeCount,
      status: 1, // Đang xử lý
      totalNetSalary: 0,
      totalBonus: 0,
      totalPayment: 0,
      totalNeedPay: 0,
      createdById: userId, 
      modifiedById: userId,
    },
  });
}

async function calculateEmployeeBonus(employee: User, startTime: string, endTime: string) {
  let totalBonus = 0;
  if (!employee.payRateId) {
    return { totalBonus: 0 };
  }

  const payRate = await prisma.payRateTemplate.findUnique({
    where: { id: employee.payRateId },
    include: {
      bonusTemplates: { include: { bonusLevels: { orderBy: { amount: 'desc' } } } },
    },
  });

  if (!payRate) return { totalBonus: 0 };

  for (const template of payRate.bonusTemplates) {
    const bonus = await calculateBonusByType(template, employee, startTime, endTime);
    totalBonus += bonus;
  }

  return { totalBonus };
}

async function calculateBonusByType(
  template: BonusTemplate & { bonusLevels: BonusLevel[] },
  employee: User,
  startTime: string,
  endTime: string
): Promise<number> {
  let calculatedBonus = 0;

  switch (template.type) {
    case 1: // Thưởng doanh số cá nhân
      const personalSales = await prisma.invoice.aggregate({
        _sum: { money: true },
        where: {
          
          saleId: Number(employee.id),
          isDeleted: false,
          createdDateTime: { gte: new Date(startTime), lte: new Date(endTime) },
        },
      });
      const personalSalesValue = Number(personalSales._sum.money) || 0;

      for (const level of template.bonusLevels) {
        if (personalSalesValue >= level.amount) {
          calculatedBonus = level.unit === 'VND' ? Number(level.bonus) : personalSalesValue * (Number(level.bonus) / 100);
          break;
        }
      }
      break;

    case 2: // Thưởng doanh số chi nhánh
      const salesByDepot  = await prisma.invoice.groupBy({
        by: ['depotId'],
        _sum: { money: true },
        where: {
          
          saleId: Number(employee.id),
          isDeleted: false,
          createdDateTime: { gte: new Date(startTime), lte: new Date(endTime) },
        },
      });

      let totalDepotBonus = 0;
      // 2. Lặp qua doanh số của từng chi nhánh
      for (const depotData of salesByDepot) {
        const depotSalesValue = Number(depotData._sum.money) || 0;
        let bonusForThisDepot = 0;

        // 3. Áp dụng mức thưởng cho doanh số của chi nhánh này
        for (const level of template.bonusLevels) {
          if (depotSalesValue >= level.amount) {
            bonusForThisDepot = level.unit === 'VND' 
              ? Number(level.bonus) 
              : depotSalesValue * (Number(level.bonus) / 100);
            break; // Tìm thấy mức phù hợp, thoát vòng lặp cho chi nhánh này
          }
        }
        // 4. Cộng dồn tiền thưởng của chi nhánh này vào tổng
        totalDepotBonus += bonusForThisDepot;
      }
      
      calculatedBonus = totalDepotBonus;
      break;
  }
  return calculatedBonus;
}

async function createPayslipRecord(paysheetId: string, employee: User, totalBonus: number) {
    const code = await generateCode('payslip', 'code', 'PL');

  return prisma.payslip.create({
    data: {
      code ,
      paysheetId,
      employeeId: employee.id,
      status: 1, // Đã tính
      bonus: totalBonus,
      grossSalary: totalBonus,
      netSalary: totalBonus,
      totalNeedPay: totalBonus,
      // Các trường khác mặc định là 0
      mainSalary: 0,
      commissionSalary: 0,
      overtimeSalary: 0,
      allowance: 0,
      deduction: 0,
      totalPayment: 0,
    },
  });
}

async function updatePaysheetTotals(paysheetId: string, totalBonus: number) {
  return prisma.paysheet.update({
    where: { id: paysheetId },
    data: {
      totalBonus,
      totalNetSalary: totalBonus,
      totalNeedPay: totalBonus,
      status: 2, // Hoàn thành
    },
  });
}