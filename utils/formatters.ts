import { navMain } from "@/constants/menu";
import dayjs from "dayjs";

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(typeof value === "string" ? parseInt(value) : value)
}

export function formatPercent(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "-"
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
}

export function getGrowthColor(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "text-gray-400"
  if (num > 0) return "text-green-600"
  if (num < 0) return "text-red-600"
  return "text-gray-600"
}

export function getTargetPercentColor(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "text-gray-400"
  if (num >= 80) return "text-green-600"
  if (num >= 60) return "text-blue-600"
  if (num >= 40) return "text-yellow-600"
  return "text-red-600"
}


export type Period = "week" | "month";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface CompareRange {
  current: DateRange;
  previous: DateRange;
}

export function getCompareRange(period: Period): CompareRange {
  const today = dayjs();

  let currentStart: dayjs.Dayjs;
  let currentEnd: dayjs.Dayjs;
  let previousStart: dayjs.Dayjs;
  let previousEnd: dayjs.Dayjs;

  switch (period) {
    case "week":
      currentStart = today.startOf("week");
      currentEnd = today; // chỉ tính đến hôm nay
      previousStart = today.subtract(1, "week").startOf("week");
      previousEnd = previousStart.add(currentEnd.diff(currentStart, "day"), "day");
      break;

    case "month":
      currentStart = today.startOf("month");
      currentEnd = today; // chỉ tính đến hôm nay
      previousStart = today.subtract(1, "month").startOf("month");
      previousEnd = previousStart.add(currentEnd.diff(currentStart, "day"), "day");
      break;

    default:
      throw new Error(`Invalid period: ${period}`);
  }

  return {
    current: {
      startDate: currentStart.format("YYYY-MM-DD"),
      endDate: currentEnd.format("YYYY-MM-DD"),
    },
    previous: {
      startDate: previousStart.format("YYYY-MM-DD"),
      endDate: previousEnd.format("YYYY-MM-DD"),
    },
  };
}

export function findTitleFromNav(pathname: string) {
  function search(items: typeof navMain) : string | undefined {
    for (const item of items) {
      if (item.url === pathname) return item.title;
      if (item.items) {
        const found = search(item.items);
        if (found) return found;
      }
    }
    return undefined;
  }

  return search(navMain) || "Không xác định";
}