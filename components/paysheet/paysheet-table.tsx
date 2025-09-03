"use client";

import * as React from "react";
import { VisibilityState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { ExpandedRowContent } from "./expanded-row-content";
import { TotalRow } from "./total-row";
import { usePaysheets } from "@/context/PaysheetContext";

export function PaysheetTable() {
  const {
    paysheets,
    totalRow,
    pageCount,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    isLoading,
  } = usePaysheets();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      employeeTotal: false,
      note: false,
      status: false,
    });

  return (
    <DataTable
      columns={columns}
      data={paysheets}
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
      totalData={totalRow}
      renderTotalRow={(table, totalData) => {
        if (!totalData) {
          return null; // Trả về null nếu không có dữ liệu tổng
        }
        return <TotalRow table={table} totalData={totalData} />;
      }}
    />
  );
}
