// src/components/datatable/paysheet-total-row.tsx
import { TableRow, TableCell } from "@/components/ui/table";
import { PaysheetTotalRow } from "@/types/type-ui";
import { formatNumber } from "@/utils/formatters";
import { Table as TableTanstack } from "@tanstack/react-table";

// Định nghĩa kiểu dữ liệu cho props, sử dụng một kiểu generic
interface TotalRowProps<TData> {
  table: TableTanstack<TData>;
  totalData?: PaysheetTotalRow;
}

export const TotalRow = <TData,>({
  table,
  totalData,
}: TotalRowProps<TData>) => {
  if (!totalData) {
    return null;
  }

  return (
    <TableRow>
      {table.getVisibleFlatColumns().map((column) => {
        // Ép kiểu totalData thành Record để truy cập an toàn bằng string
        const totalDataRecord = totalData as Record<string, number>;
        const totalValue = totalDataRecord[column.id];

        // Render các ô còn lại
        return (
          <TableCell key={column.id} className="font-bold">
            {totalValue !== undefined ? formatNumber(totalValue) : ""}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
