import { Table } from "@tanstack/react-table";

interface DataTableSelectedProps<TData> {
  table: Table<TData>;
}

export function DataTableSelected<TData>({
  table,
}: DataTableSelectedProps<TData>) {
  if (table.getFilteredSelectedRowModel().rows.length < 1) return;
  return (
    <div className="text-primary text-sm">
      {table.getFilteredSelectedRowModel().rows.length} dòng được chọn
    </div>
  );
}
