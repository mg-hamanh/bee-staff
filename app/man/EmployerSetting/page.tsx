// /app/admin/settings/page.tsx

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { payRollSettings } from "@/constants/pay-roll-settings";
import { FileClock } from "lucide-react";
import api from "@/lib/api-client"; // Hoặc một instance axios dành cho server
import { SettingValues } from "@/types/type-ui";
import TemplatesTable from "@/components/settings/TemplatesTable";

interface ApiResponse {
  data: SettingValues;
  message: string;
}

export default async function Page() {
  let dynamicSettings: SettingValues = {};

  try {
    // SỬA: Bọc cuộc gọi API trong try...catch để xử lý lỗi an toàn
    const response = await api.get("/paysheets/settings");

    // SỬA: Đảm bảo response.data tồn tại trước khi gán
    const apiData: ApiResponse = response.data;
    if (apiData && apiData.data) {
      dynamicSettings = apiData.data;
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu cài đặt:", error);
    // Có thể trả về một đối tượng rỗng để tránh crash
    dynamicSettings = {};
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {payRollSettings.map((setting) => {
        // SỬA: Sử dụng optional chaining để truy cập an toàn
        const dynamicValue = dynamicSettings?.[setting.code];
        const IconComponent = setting.icon;

        const isSwitch = typeof dynamicValue === "boolean";
        const switchState = isSwitch ? dynamicValue : false;

        return (
          <div
            key={setting.id}
            className="w-full flex flex-row items-center justify-between bg-white rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              {IconComponent && (
                <IconComponent className="h-6 w-6 text-primary" />
              )}
              <div className="flex flex-col gap-2">
                <Label className="text-md">{setting.title}</Label>
                <p className="text-sm text-accent-foreground">
                  {setting.description}
                </p>
              </div>
            </div>
            {isSwitch ? (
              <Switch checked={switchState} />
            ) : (
              <Button>Chi tiết</Button>
            )}
          </div>
        );
      })}
      <div className="w-full flex flex-row items-center justify-between bg-white rounded-lg p-4">
        <div className="flex items-center gap-4">
          <FileClock className="h-6 w-6 text-primary" />
          <div className="flex flex-col gap-2">
            <Label className="text-md">Thiết lập mẫu thưởng</Label>
            <p className="text-sm text-accent-foreground">
              Thưởng, Phụ cấp, Giảm trừ
            </p>
          </div>
        </div>
        <TemplatesTable />
      </div>
    </div>
  );
}
