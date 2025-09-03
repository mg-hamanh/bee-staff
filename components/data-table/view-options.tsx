"use client";

import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="ml-auto flex h-8">
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px] p-2">
        <div className="grid grid-cols-2 gap-2">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <div
                  key={column.id}
                  className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <Checkbox
                    id={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  />
                  <Label
                    htmlFor={column.id}
                    className="text-sm font-normal leading-none cursor-pointer"
                  >
                    {column.columnDef.meta?.title ?? column.id}
                  </Label>
                </div>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
