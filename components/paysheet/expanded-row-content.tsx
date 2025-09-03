import { Row, Table as TableTanstack } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  CircleDollarSign,
  FileCheck,
  FileDown,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { PaysheetUI } from "@/types/type-ui";
import dayjs from "dayjs";
import BeeTooltip from "../bee-ui/BeeTooltip";
import { usePayslips } from "@/hooks/usePayslips";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatNumber } from "@/utils/formatters";

interface ExpandedRowContentProps<TData> {
  row: Row<TData>;
  table: TableTanstack<TData>;
}

export function ExpandedRowContent<TData>({
  row,
  table,
}: ExpandedRowContentProps<TData>) {
  const paysheet = row.original as PaysheetUI;

  const { data: payslips } = usePayslips(paysheet.id);

  const handleDelete = () => {
    console.log("delete");
  };

  return (
    <div className="border-x-2 border-x-primary border-b-2 border-b-primary p-2">
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="payslip">Phiếu thưởng</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="info">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4 px-2">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  const title = column.columnDef.meta?.title ?? column.id;
                  const value = row.getValue(column.id);

                  return (
                    <div key={column.id} className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {title}
                      </p>
                      <p>{value ? String(value) : "Chưa có"}</p>
                      <Separator />
                    </div>
                  );
                })}
            </div>
            <Separator />
            <div className="flex flex-row items-center justify-between px-6">
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"ghost"}>
                      <Trash />
                      Hủy bỏ
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hủy bỏ bảng lương</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Bạn có chắc chắn muốn hủy bảng lương ${paysheet.code} này không?`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Separator />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bỏ qua</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex flex-row items-center gap-2">
                <p>Dữ liệu được cập nhật vào:</p>
                <span>
                  {dayjs(paysheet.modifiedDate).format("DD/MM/YYYY HH:mm:ss")}
                </span>
                <BeeTooltip content="Tải lại bảng lương để xem dữ liệu mới nhất" />
                <Button
                  variant={"outline"}
                  className="rounded-full text-primary border-primary hover:text-primary"
                >
                  <RefreshCcw />
                  Tải lại dữ liệu
                </Button>
              </div>
              <div className="flex gap-2">
                <Button>
                  <FileCheck />
                  Xem bảng lương
                </Button>
                <Button variant={"outline"}>
                  <FileDown />
                  Xuất file
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="payslip">
          <div className="flex flex-col gap-4">
            <div>
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow>
                    <TableHead>Mã phiếu</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead className="text-right">Tổng thưởng</TableHead>
                    <TableHead className="text-right">Đã trả NV</TableHead>
                    <TableHead className="text-right">Còn cần trả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold">
                      {formatNumber(paysheet.totalBonus)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatNumber(paysheet.totalPayment)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatNumber(paysheet.totalNeedPay)}
                    </TableCell>
                  </TableRow>
                  {payslips &&
                    payslips.map((payslip) => (
                      <TableRow key={payslip.id}>
                        <TableCell>{payslip.code}</TableCell>
                        <TableCell>{payslip.employee.name}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(payslip.bonus)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(payslip.totalPayment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(payslip.totalNeedPay)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Separator />
            <div className="flex flex-row items-center justify-end px-6">
              <Button>
                <CircleDollarSign />
                Thanh toán
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
