// expanded-row-content.tsx

import { Row, Table as TableTanstack } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserUI } from "@/types/type-ui";
import Image from "next/image";
import { Button } from "../ui/button";
import { FileX, RefreshCw, Trash, UserRoundX } from "lucide-react";
import { Separator } from "../ui/separator";
import { UserDialog } from "./add-form";
import { Label } from "../ui/label";
import BeeHTMLTooltip from "../bee-ui/BeeHTMLTooltip";
import { modes, types } from "@/constants/bonus-desc";
import { CreateUser, UpdateUser } from "@/types/type-zod";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { useUsers } from "@/context/UsersProvider";

interface ExpandedRowContentProps<TData> {
  row: Row<TData>;
  table: TableTanstack<TData>;
}

export function ExpandedRowContent<TData>({
  row,
  table,
}: ExpandedRowContentProps<TData>) {
  const user = row.original as UserUI;
  const { updateUser, deleteUser } = useUsers();

  const handleUpdate = (data: UpdateUser | CreateUser) => {
    return updateUser(user.id, data as UpdateUser);
  };

  const handleDelete = () => {
    if (user.type === "nhanh") {
      toast.warning("Không thể xóa nhân viên từ Nhanh.vn");
      return;
    }
    deleteUser(user.id);
  };

  return (
    <div className="border-x-2 border-x-primary border-b-2 border-b-primary p-2">
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="setting">Thiết lập thưởng</TabsTrigger>
          <TabsTrigger value="paysheet">Phiếu thưởng</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="info">
          <div className="flex flex-col gap-4">
            <Image
              src={user.image || "/thumbnail-empty.svg"}
              alt="image's user"
              width={100}
              height={100}
              className=" bg-accent rounded-md"
            />
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
                      {user.isActive ? <UserRoundX /> : <RefreshCw />}
                      {user.isActive ? "Ngừng làm việc" : "Quay lại làm việc"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{`Xác nhận nhân viên ${
                        user.isActive ? "ngừng" : "quay lại"
                      } làm việc?`}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Hệ thống sẽ ghi nhận nhân viên ${user.name} ${
                          user.isActive ? "ngừng" : "quay lại"
                        } làm việc. Tuy nhiên, các dữ liệu chấm công phiếu lương nếu có của nhân viên này sẽ vẫn được giữ lại.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Separator />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bỏ qua</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          updateUser(user.id, {
                            ...user,
                            isActive: !user.isActive,
                          })
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {!user.isActive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={"ghost"}>
                        <Trash />
                        Xóa nhân viên
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa nhân viên</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`Hệ thống sẽ xóa hoàn toàn nhân viên ${user.name} này nhưng vẫn giữ các dữ liệu chấm công phiếu lương nếu có. Bạn có chắc chắn muốn xóa?`}
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
                )}
              </div>

              <div>
                <UserDialog
                  user={user}
                  userTab="info"
                  onSubmit={handleUpdate}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="setting">
          <div className="flex flex-col gap-4 p-4">
            {user.payRateId ? (
              <>
                <div className="flex gap-4">
                  <Label>Mẫu thưởng</Label>
                  <p>{user.payRateTemplate?.name}</p>
                </div>
                <div className="flex gap-4">
                  <Label>Thưởng</Label>

                  <p>
                    {`
                ${
                  types.find(
                    (t) =>
                      t.value === user.payRateTemplate?.bonusTemplates?.[0].type
                  )?.label
                }
                (
                 ${
                   modes.find(
                     (t) =>
                       t.value ===
                       user.payRateTemplate?.bonusTemplates?.[0].type
                   )?.label
                 } 
                )`}
                  </p>
                  <BeeHTMLTooltip
                    content={
                      user.payRateTemplate?.bonusTemplates?.[0].description
                    }
                  />
                </div>
                <div>
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-medium">Loại hình</TableHead>
                        <TableHead className="font-medium">Doanh thu</TableHead>
                        <TableHead className="font-medium">Thưởng</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.payRateTemplate?.bonusTemplates?.[0].bonusLevels?.map(
                        (level) => (
                          <TableRow key={level.id || level.clientId}>
                            <TableCell>Tư vấn bán hàng</TableCell>
                            <TableCell>
                              {formatCurrency(level.amount ?? 0)}
                            </TableCell>
                            <TableCell>
                              {formatPercent(level.bonus ?? 0)}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Separator />
                <div className="flex flex-row items-center justify-end px-6">
                  <UserDialog
                    user={user}
                    userTab="payRate"
                    onSubmit={handleUpdate}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <FileX className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Mẫu thưởng của nhân viên chưa được thiết lập. Vui lòng thiết
                  lập lượng cho nhân viên.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="paysheet">
          <div className="p-4">Tính năng sẽ có trong tương lai</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
