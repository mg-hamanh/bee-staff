import { FileChartColumnIncreasing, Frame, PieChart, Settings2, UsersRound } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<any>; // icon optional
  items?: NavItem[];
}

export const navMain: NavItem[]= 
   [
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
          title: "Thưởng",
          url: "/man/EmployerBonus",
        },
        {
          title: "Phạt",
          url: "#",
        },
      ],
    },
    {
      title: "Báo cáo",
      url: "#",
      icon: FileChartColumnIncreasing,
      items: [
        {
          title: "Thưởng nhân viên",
          url: "/man/BonusReport",
        },
        {
          title: "Phạt nhân viên",
          url: "#",
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
          url: "/man/BonusSetting",
        },
      ],
    },
  ]