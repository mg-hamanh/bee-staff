"use client";

import { Table } from "@tanstack/react-table";
import { CircleQuestionMark, X } from "lucide-react";

import { Button } from "../ui/button";
import { DataTableFacetedFilter } from "../data-table/faceted-filter";
import { DataTableViewOptions } from "../data-table/view-options";
import { toast } from "sonner";
import { paysheetStatus, periods } from "./data";
import { PaysheetAddDialog } from "./add-form";
import BeeSearchBar from "../bee-ui/BeeSearchBar";
import { DataTableSelected } from "../data-table/selected";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-1 items-center gap-2">
        <BeeSearchBar
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          placeholder="Tìm theo tên nhân viên"
          onSearch={(value: string) =>
            table.getColumn("code")?.setFilterValue(value)
          }
        />
        {table.getColumn("periodId") && (
          <DataTableFacetedFilter
            column={table.getColumn("periodId")}
            title="Kỳ hạn trả"
            options={periods}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Trạng thái"
            options={paysheetStatus}
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
        <DataTableSelected table={table} />
        <PaysheetAddDialog />
        <DataTableViewOptions table={table} />
        <Button
          variant={"outline"}
          size={"icon"}
          className="ml-auto h-8 flex"
          onClick={() =>
            toast.info(
              "Tính năng 'Hướng dẫn sử dụng' sẽ được cập nhật trong tương lai."
            )
          }
        >
          <CircleQuestionMark />
        </Button>
      </div>
    </div>
  );
}
