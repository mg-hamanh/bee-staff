"use client";

import { Checkbox } from "../ui/checkbox";
// import { Badge } from "../ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../data-table/column-header";
import { DataTableRowActions } from "../data-table/row-action";
import { roles } from "./data";
import { UserUI } from "@/types/type-ui";

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
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhân viên" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "roleId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vai trò" />
    ),
    cell: ({ row }) => {
      const role = roles.find((role) => role.value === row.getValue("roleId"));

      if (!role) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center gap-2">
          <span>{role.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center gap-2">
  //         {priority.icon && (
  //           <priority.icon className="text-muted-foreground size-4" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
      // row={row}
      />
    ),
  },
];
