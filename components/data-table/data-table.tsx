"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
  Table as TanStackTable,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BeeSpinner } from "../bee-ui/BeeSpinner";
import BeeEmpty from "../bee-ui/BeeEmpty";

interface DataTableProps<TData, TValue, TTotalData> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  pageCount: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  renderExpandedContent: (
    row: Row<TData>,
    table: TanStackTable<TData>
  ) => React.ReactNode;
  renderToolbar: (table: TanStackTable<TData>) => React.ReactNode;
  totalData?: TTotalData;
  renderTotalRow?: (
    table: TanStackTable<TData>,
    totalData: TTotalData
  ) => React.ReactNode;
}
export function DataTable<TData, TValue, TTotalData>({
  columns,
  data,
  isLoading,
  pageCount,
  pagination,
  setPagination,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
  renderExpandedContent,
  renderToolbar,
  renderTotalRow,
  totalData,
}: DataTableProps<TData, TValue, TTotalData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount,

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
      rowSelection,
      expanded,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,

    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 ">
      {renderToolbar(table)}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center ">
            <BeeSpinner size={40} className="text-primary" />
          </div>
        )}

        {data.length === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center ">
            <BeeEmpty />
          </div>
        )}

        <ScrollArea
          className={`w-full h-[calc(100vh-200px)] rounded-md bg-white`}
        >
          <Table>
            <TableHeader className="sticky top-0 bg-primary/8 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {renderTotalRow && totalData && renderTotalRow(table, totalData)}
              {table.getRowModel().rows?.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "cursor-pointer",
                        "data-[state=selected]:bg-white",
                        row.getIsExpanded() &&
                          "bg-muted/50 border-x-2 border-x-primary border-t-2 border-t-primary"
                      )}
                      onClick={() => {
                        const isExpanded = row.getIsExpanded();
                        setExpanded(isExpanded ? {} : { [row.id]: true });
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow className={cn("hover:bg-transparent ")}>
                        <TableCell className="p-0" colSpan={columns.length}>
                          {renderExpandedContent(row, table)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      {data.length > 0 && <DataTablePagination table={table} />}
    </div>
  );
}
