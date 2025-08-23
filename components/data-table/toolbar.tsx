"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "./view-options";
import { DataTableFacetedFilter } from "./faceted-filter";
import { roles } from "../user/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Tìm theo mã, tên nhân viên,.."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("roleId") && (
          <DataTableFacetedFilter
            column={table.getColumn("roleId")}
            title="Vai trò"
            options={roles}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Hủy lọc
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm">Add Task</Button>
      </div>
    </div>
  );
}
