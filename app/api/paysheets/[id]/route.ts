import { requireAdmin } from '@/lib/auth/guard';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {

    const { error } = await requireAdmin(req);
      if (error) return error;

  try {
    const { id } = await params;

    const paysheet = await prisma.paysheet.findUnique({
      where: {
        id,
      },
      include: {
        payslips: {
          include: {
            employee: true,
          }
        }
      }
    });

    if (!paysheet) {
      return NextResponse.json(
        { error: 'Không tìm thấy bảng lương' },
        { status: 404 }
      );
    }

    return NextResponse.json(paysheet);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bảng lương:', error);
    return NextResponse.json(
      { error: 'Không thể truy vấn cơ sở dữ liệu' },
      { status: 500 }
    );
  }
}