import { requireAdmin } from '@/lib/auth/guard';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {

    const { error } = await requireAdmin(req);
      if (error) return error;

  try {
    const { id } = await params;

    const payslip = await prisma.payslip.findUnique({
      where: {
        id,
      },
      include: {
        employee: true
      }
    });

    if (!payslip) {
      return NextResponse.json(
        { error: 'Không tìm thấy bảng lương' },
        { status: 404 }
      );
    }

    return NextResponse.json(payslip);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bảng lương:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn cơ sở dữ liệu' },
      { status: 500 }
    );
  }
}