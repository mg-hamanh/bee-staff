import { requireAdmin } from "@/lib/auth/guard";
import prisma from "@/lib/prisma";
import { createBonusPaysheet } from "@/services/payrollService";
import { createPaysheetSchema } from "@/types/type-zod";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');

    const sortParam = searchParams.get('sort') || 'createdDate desc';
    const [sortField, sortOrder] = sortParam.split(' ');
    const orderBy = { [sortField]: sortOrder };

    const filterConditions: Prisma.PaysheetWhereInput[] = [];
    const activeFilters = [];
    
    // Lặp qua tất cả các params để tìm filter
    for (const [key, value] of searchParams.entries()) {
      if (['pageIndex', 'pageSize', 'sort'].includes(key)) continue;
      activeFilters.push({ id: key, value: value });
      
      if (key === 'code') {
        filterConditions.push({
          OR: [
            { code: { contains: value, mode: 'insensitive' } },
            { name: { contains: value, mode: 'insensitive' } }
          ]
        });
      } else if (key === 'periodId') {
        filterConditions.push({ periodId: { in: value.split(',').map(Number) } });
      } else if (key === 'status') {
        filterConditions.push({ status: { in: value.split(',').map(Number) } });
      }
    }
    
    // Kết hợp tất cả các điều kiện lọc vào một đối tượng duy nhất với toán tử AND
    const where: Prisma.PaysheetWhereInput = {
      AND: filterConditions,
    };

    const [paysheets, totalFiltered, totalAll, aggregation] = await prisma.$transaction([
      prisma.paysheet.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        where, // Đã sửa: Truyền đối tượng `where` đã định dạng
        orderBy,
      }),
      
      prisma.paysheet.count({ where }), // Đã sửa
      prisma.paysheet.count(),
      
      prisma.paysheet.aggregate({
        _sum: {
          totalNetSalary: true,
          totalBonus: true,
          totalPayment: true,
          totalNeedPay: true,
        },
        where, // Đã sửa
      }),
    ]);

    const pageCount = Math.ceil(totalFiltered / pageSize);

    return NextResponse.json({
      totalRow: {
        totalNetSalary: aggregation._sum.totalNetSalary || 0,
        totalBonus: aggregation._sum.totalBonus || 0,
        totalPayment: aggregation._sum.totalPayment || 0,
        totalNeedPay: aggregation._sum.totalNeedPay || 0,
      },
      
      total: totalAll,
      data: paysheets,
      filter: activeFilters,
      pagination: {
        pageCount,
        total: totalFiltered,
        pageIndex,
        pageSize,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bảng lương:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn cơ sở dữ liệu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate dữ liệu đầu vào
    const validatedData = createPaysheetSchema.parse(body);

    // 2. Gọi service để xử lý logic chính
    const newPaysheet = await createBonusPaysheet(validatedData);

    // 3. Trả về kết quả thành công
    return NextResponse.json(
      { message: "Bảng lương thưởng đã được tạo thành công", data: newPaysheet },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bảng lương:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn cơ sở dữ liệu' },
      { status: 500 }
    );
  }
}