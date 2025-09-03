"use client";

import { Checkbox } from "../ui/checkbox";
import { ColumnDef, RowData } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../data-table/column-header";
import { labels, roles } from "./data";
import { UserUI } from "@/types/type-ui";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { KeyRound } from "lucide-react";

// Khai báo để TypeScript hiểu meta.title
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string;
  }
}

export const columns: ColumnDef<UserUI>[] = [
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
    accessorKey: "image",
    meta: {
      title: "Ảnh",
    },
    header: "",
    cell: ({ row }) => {
      const image = row.getValue("image") ?? "/thumbnail-empty.svg";
      const name = row.original.name;
      return <Image src={image as string} alt={name} width={24} height={24} />;
    },
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
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.type);

      return (
        <div className="flex flex-row items-center gap-2">
          {label && (
            <Badge
              variant="outline"
              className={
                label.value === "nhanh"
                  ? "bg-[#c31f26] text-white"
                  : "bg-primary/25"
              }
            >
              {label.label}
            </Badge>
          )}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
          {row.original.isAdmin && <KeyRound className="text-primary h-4" />}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    meta: {
      title: "Tên đăng nhập",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đăng nhập" />
    ),
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
    enableSorting: false,
    enableHiding: true,
  },

  {
    accessorKey: "email",
    meta: {
      title: "Email",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "mobile",
    meta: {
      title: "Số điện thoại",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "role",
    meta: {
      title: "Vai trò",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vai trò" />
    ),
    accessorFn: (row) =>
      roles.find((role) => role.value === row.role)?.label ?? row.role,
    cell: ({ row }) => {
      const roleLabel = row.getValue("role") as string;

      return (
        <div className="flex w-[200px] items-center gap-2">
          <span>{roleLabel}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.role);
    },
  },
  {
    accessorKey: "depots",
    meta: {
      title: "Chi nhánh",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chi nhánh" />
    ),
    cell: ({ row }) => <div>{row.getValue("depots")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "payRateId",
    header: "", // Không có tiêu đề
    cell: () => null, // Không hiển thị nội dung
    enableHiding: false, // Quan trọng: Cho phép ẩn cột
    size: 0, // Đặt kích thước cột là 0
  },
  {
    accessorKey: "payRateTemplate",
    header: "", // Không có tiêu đề
    cell: () => null, // Không hiển thị nội dung
    enableHiding: false, // Quan trọng: Cho phép ẩn cột
    size: 0, // Đặt kích thước cột là 0
  },
  {
    id: "isActive",
    meta: {
      title: "Trạng thái",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    accessorFn: (row) => (row.isActive ? "Đang làm việc" : "Đã nghỉ"),
    cell: ({ row }) => {
      const status = row.getValue("isActive") as string;

      return (
        <Badge variant={status === "Đang làm việc" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.isActive);
    },
    enableSorting: false,
    enableHiding: true,
  },
];
