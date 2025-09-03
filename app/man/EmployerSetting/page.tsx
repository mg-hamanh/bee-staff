// /app/admin/settings/page.tsx

import TemplatesTable from "@/components/settings/TemplatesTable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { payRollSettings } from "@/constants/pay-roll-settings";
import api from "@/lib/api-client";
import { SettingValues } from "@/types/type-ui";
import { FileClock } from "lucide-react";

interface ApiResponse {
  data: SettingValues;
  message: string;
}

export default async function Page() {
  const response = await api.get("/paysheets/settings");
  const apiData: ApiResponse = response.data;
  const dynamicSettings = apiData.data;
  return (
    <div className="flex flex-col gap-2 mt-2">
      {payRollSettings.map((setting) => {
        const dynamicValue = dynamicSettings[setting.code];
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
