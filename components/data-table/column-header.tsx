import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(undefined, false)}
      className={cn("data-[state=open]:bg-accent px-0 gap-2 h-8", className)}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="size-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="size-4" />
      ) : (
        ""
      )}
    </Button>
  );
}
