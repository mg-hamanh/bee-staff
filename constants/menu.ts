import { ChartBar, FileChartColumnIncreasing, Frame, PieChart, Settings2, UsersRound } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<any>; // icon optional
  items?: NavItem[];
}

export const navMain: NavItem[]= 
   [{
    title: "Tổng quan",
    url: "/man/Dashboard",
    icon: ChartBar,
   },
    {
      title: "Nhân viên",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Danh sách nhân viên",
          url: "/man/Employee",
        },
        {
          title: "Bảng thưởng",
          url: "/man/Paysheet",
        },
      ],
    },
    {
      title: "Báo cáo",
      url: "#",
      icon: FileChartColumnIncreasing,
      items: [
        {
          title: "Báo cáo hàng tuần",
          url: "/man/WeeklyReport",
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Tính thưởng",
          url: "/man/EmployerSetting",
        },
      ],
    },
  ]