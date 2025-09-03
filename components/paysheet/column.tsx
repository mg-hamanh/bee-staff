"use client";

import { Checkbox } from "../ui/checkbox";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../data-table/column-header";
import { paysheetStatus, periods } from "./data";
import { PaysheetUI } from "@/types/type-ui";
import { formatNumber } from "@/utils/formatters";

// Khai báo để TypeScript hiểu meta.title
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string;
  }
}

export const columns: ColumnDef<PaysheetUI>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "",
    cell: () => null,
    enableHiding: false,
    size: 0,
  },
  {
    accessorKey: "code",
    meta: {
      title: "Mã",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    meta: {
      title: "Tên",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "periodId",
    meta: {
      title: "Kỳ hạn trả",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kỳ hạn trả" />
    ),
    accessorFn: (row) =>
      periods.find((period) => period.value === row.periodId)?.label ??
      row.periodId,
    cell: ({ row }) => {
      const periodLabel = row.getValue("periodId") as string;

      return (
        <div className="flex w-[100px] items-center gap-2">
          <span>{periodLabel}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.periodId);
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "periodName",
    meta: {
      title: "Kỳ làm việc",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kỳ làm việc" />
    ),
    cell: ({ row }) => <div>{row.getValue("periodName")}</div>,
    enableSorting: false,
    enableHiding: true,
  },

  {
    accessorKey: "employeeTotal",
    meta: {
      title: "Số nhân viên",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số nhân viên" />
    ),
    cell: ({ row }) => <div>{row.getValue("employeeTotal")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalNetSalary",
    meta: {
      title: "Tổng lương",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng lương" />
    ),
    cell: ({ row }) => (
      <div>{formatNumber(row.getValue("totalNetSalary"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalBonus",
    meta: {
      title: "Tổng thưởng",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng thưởng" />
    ),
    cell: ({ row }) => <div>{formatNumber(row.getValue("totalBonus"))}</div>,
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "totalPayment",
    meta: {
      title: "Đã trả nhân viên",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đã trả nhân viên" />
    ),
    cell: ({ row }) => <div>{formatNumber(row.getValue("totalPayment"))}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalNeedPay",
    meta: {
      title: "Còn cần trả",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Còn cần trả" />
    ),
    cell: ({ row }) => <div>{formatNumber(row.getValue("totalNeedPay"))}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "status",
    meta: {
      title: "Trạng thái",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    accessorFn: (row) =>
      paysheetStatus.find((status) => status.value === row.status)?.label ??
      row.status,
    cell: ({ row }) => {
      const statusLabel = row.getValue("status") as string;

      return (
        <div className="flex w-[100px] items-center gap-2">
          <span>{statusLabel}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.status);
    },
  },
];
