import { Badge } from "@/components/ui/badge";
import { formatPercent, getTargetPercentColor } from "@/utils/formatters";

interface TargetCellProps {
  percent: string | number | null | undefined;
}

export function TargetCell({ percent }: TargetCellProps) {
  if (!percent || percent === "null" || percent === "undefined") {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <Badge
      variant="outline"
      className={`font-semibold ${getTargetPercentColor(percent)}`}
    >
      {formatPercent(percent)}
    </Badge>
  );
}
