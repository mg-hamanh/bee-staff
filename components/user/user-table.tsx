"use client";

import * as React from "react";
import { VisibilityState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { ExpandedRowContent } from "./expanded-row-content";
import { DataTableToolbar } from "./toolbar";
import { useUsers } from "@/context/UsersProvider";

export function UserTable() {
  const {
    users,
    pageCount,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    isLoading,
  } = useUsers();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      username: false,
      depots: false,
      payRateId: false,
      isActive: false,
    });

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      pageCount={pageCount}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      renderExpandedContent={(row, table) => (
        <ExpandedRowContent row={row} table={table} />
      )}
      renderToolbar={(table) => <DataTableToolbar table={table} />}
    />
  );
}
