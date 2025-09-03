"use client";

import { Table } from "@tanstack/react-table";
import { CircleQuestionMark, X } from "lucide-react";

import { Button } from "../ui/button";
import { status, roles } from "../user/data";
import { UserDialog } from "../user/add-form";
import { DataTableFacetedFilter } from "../data-table/faceted-filter";
import { DataTableViewOptions } from "../data-table/view-options";
import { toast } from "sonner";
import BeeSearchBar from "../bee-ui/BeeSearchBar";
import { DataTableSelected } from "../data-table/selected";
import { useUsers } from "@/context/UsersProvider";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { createUser } = useUsers();

  return (
    <div className="flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-1 items-center gap-2">
        <BeeSearchBar
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          placeholder="Tìm theo tên nhân viên"
          onSearch={(value: string) =>
            table.getColumn("name")?.setFilterValue(value)
          }
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Vai trò"
            options={roles}
          />
        )}
        {table.getColumn("isActive") && (
          <DataTableFacetedFilter
            column={table.getColumn("isActive")}
            title="Trạng thái"
            options={status}
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
        <UserDialog userTab="info" onSubmit={createUser} />
        <DataTableViewOptions table={table} />
        <Button
          variant={"outline"}
          size={"icon"}
          className="ml-auto flex h-8 "
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
