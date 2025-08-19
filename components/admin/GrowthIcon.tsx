import { TrendingDown, TrendingUp } from "lucide-react";

export function getGrowthIcon(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return null;
  if (num > 0) return <TrendingUp className="h-4 w-4" />;
  if (num < 0) return <TrendingDown className="h-4 w-4" />;
  return null;
}
