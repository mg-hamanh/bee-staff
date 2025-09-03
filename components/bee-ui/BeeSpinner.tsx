import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export const BeeSpinner = ({ size = 24, className }: SpinnerProps) => {
  return (
    <Loader2
      className={cn("animate-spin", className)}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
