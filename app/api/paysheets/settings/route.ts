import prisma from "@/lib/prisma";
import { SettingValues } from "@/types/type-ui";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const settings = await prisma.payRollSetting.findMany();

    const formattedSettings = settings.reduce((acc: SettingValues, setting) => {
      if (setting.value !== null) {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {});
    

    return NextResponse.json({
      data: formattedSettings,
      message: "Lấy danh sách cài đặt thành công."
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh sách cài đặt:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách cài đặt' },
      { status: 500 }
    );
  }
}

