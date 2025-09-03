// src/constants/pay-roll-settings.ts
import { CalendarCog, CalendarSync, RefreshCcw, LucideIcon } from "lucide-react";

// Đổi tên interface thành PayRollSetting để tránh trùng lặp
export interface PayRollSetting {
  id: number;
  code: string;
  title: string;
  value?: number;
  description: string;
  isActive?: boolean;
  icon: LucideIcon;
}

// Đây là nguồn dữ liệu tĩnh duy nhất
export const payRollSettings: PayRollSetting[] = [
  {
    id: 1,
    code: "startDateOfEveryMonth",
    title: "Ngày tính lương",
    value: 1,
    description: "Ngày bắt đầu tính công cho nhân viên có kỳ lương hàng tháng",
    icon: CalendarCog,
  },
  {
    id: 2,
    code: "isAutoCreatePaysheet",
    title: "Tự động tạo bảng tính lương",
    description: "Bảng tính lương sẽ được tự động tạo mới vào mỗi kỳ lương",
    isActive: true,
    icon: CalendarSync,
  },
  {
    id: 3,
    code: "isAutoUpdatePaysheet",
    title: "Tự động cập nhật bảng tính lương",
    description: "Bảng tính lương sẽ được tự động cập nhật mỗi ngày",
    isActive: true,
    icon: RefreshCcw,
  },
];