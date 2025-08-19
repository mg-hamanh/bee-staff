import { formatPercent, getGrowthColor } from "@/utils/formatters";
import { getGrowthIcon } from "./GrowthIcon";

interface GrowthCellProps {
  value: string | number | null | undefined;
}

export default function GrowthCell({ value }: GrowthCellProps) {
  if (value === null || value === undefined) {
    return <span className="text-xs text-gray-400">-</span>;
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${getGrowthColor(value)}`}>
      {getGrowthIcon(value)}
      {formatPercent(value)}
    </div>
  );
}
