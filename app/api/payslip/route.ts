import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    id: string; // Đây là ID của Paysheet
  };
}

/**
 * @method GET
 * @description Lấy danh sách phiếu lương thuộc về một bảng lương
 * @param params - Chứa ID của bảng lương từ URL
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { searchParams } = new URL(request.url);
  const take = parseInt(searchParams.get('take') || '10');
  const skip = parseInt(searchParams.get('skip') || '0');

  try {
    const { id } = params;

    // Kiểm tra xem bảng lương có tồn tại không
    const paysheetExists = await prisma.paysheet.findUnique({
      where: { id},
    });

    if (!paysheetExists) {
      return NextResponse.json(
        { error: 'Không tìm thấy bảng lương' },
        { status: 404 }
      );
    }

    const where = { id };

    const payslips = await prisma.payslip.findMany({
      take,
      skip,
      where,
      include: {
        employee: true, // Lấy luôn thông tin của nhân viên liên quan
      },
      orderBy: {
        id: 'asc',
      },
    });

    const total = await prisma.payslip.count({ where });
    
    // Tính toán các giá trị tổng hợp
    // Lưu ý: Để tối ưu hiệu năng, với dữ liệu lớn nên dùng aggregate của Prisma
    const aggregation = await prisma.payslip.aggregate({
      _sum: {
        netSalary: true,
        bonus: true,
        totalNeedPay: true
      },
      where
    });

    return NextResponse.json({
      total,
      totalNetSalary: aggregation._sum.netSalary || 0,
      totalBonus: aggregation._sum.bonus || 0,
      totalNeedPay: aggregation._sum.totalNeedPay || 0,
      data: payslips,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu lương:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn cơ sở dữ liệu' },
      { status: 500 }
    );
  }
}