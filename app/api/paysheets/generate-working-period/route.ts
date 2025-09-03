import dayjs from 'dayjs';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const workingPeriods = [];
    const totalPeriodsToGenerate = 24; // Tạo danh sách 2 năm gần nhất

    // Bắt đầu tạo kỳ lương từ 2 tháng trong tương lai so với ngày hiện tại
    const firstPeriodDate = dayjs().add(2, 'month');

    for (let i = 0; i < totalPeriodsToGenerate; i++) {
      // Lấy tháng hiện tại của vòng lặp (lùi dần về quá khứ)
      const targetDate = firstPeriodDate.subtract(i, 'month');
      
      // Tính ngày bắt đầu và kết thúc của tháng
      const startTime = targetDate.startOf('month');
      const endTime = targetDate.endOf('month');

      workingPeriods.push({
        id: i + 1,
        name: `${startTime.format('DD/MM/YYYY')} - ${endTime.format('DD/MM/YYYY')}`,
        // Định dạng chuỗi thời gian chính xác theo yêu cầu
        startTime: `${startTime.format('YYYY-MM-DDTHH:mm:ss')}.0000000`,
        endTime: `${endTime.format('YYYY-MM-DDTHH:mm:ss')}.0000000`,
      });
    }

    // Trả về theo đúng cấu trúc JSON mong muốn
    return NextResponse.json({
      data: workingPeriods,
      message: ""
    });

  } catch (error) {
    console.error('Lỗi khi tạo danh sách kỳ lương:', error);
    return NextResponse.json(
      { error: 'Không thể tạo danh sách kỳ lương' },
      { status: 500 }
    );
  }
}