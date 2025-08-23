// /app/admin/settings/components/ManageUsersDialog.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search, Check } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { PayRateTemplateUI } from "@/types/type-ui";
import { useTemplates } from "./context/TemplatesProvider";
import { useUsers } from "./hooks/useUsers";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { User } from "@/types/type-zod";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface ManageUsersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateToEdit: PayRateTemplateUI | null;
}

const userSample: User = {
  id: "new",
  depots: [],
  roleId: 1,
  isAdmin: false,
};

export function ManageUsersDialog({
  isOpen,
  onOpenChange,
  templateToEdit,
}: ManageUsersDialogProps) {
  const { updateTemplate } = useTemplates();
  const { users: allUsers } = useUsers();
  const [currentTemplate, setCurrentTemplate] =
    useState<PayRateTemplateUI | null>(templateToEdit);

  const [selectedNewUser, setSelectedNewUser] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  // const [confirmState, setConfirmState] = useState<{
  //   open: boolean;
  //   user: User | null;
  //   message: string;
  // }>({ open: false, user: null, message: "" });

  useEffect(() => {
    setCurrentTemplate(templateToEdit);
  }, [templateToEdit]);

  // const assignedUserIds = useMemo(
  //   () => new Set(currentTemplate?.users?.map((u) => u.id) || []),
  //   [currentTemplate?.users]
  // );

  // const availableUsers = useMemo(
  //   () =>
  //     allUsers
  //       .filter((user) => !assignedUserIds.has(user.id))
  //       .filter(
  //         (user) =>
  //           user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           user.id.toLowerCase().includes(searchTerm.toLowerCase())
  //       ),
  //   [allUsers, assignedUserIds, searchTerm]
  // );

  // const performAddUser = (userToAdd: User) => {
  //   const updatedUsers = [...(currentTemplate.users || []), userToAdd];
  //   setCurrentTemplate({
  //     ...currentTemplate,
  //     users: updatedUsers,
  //     totalUser: updatedUsers.length,
  //   });
  //   setSelectedNewUser("");
  // };

  // const handleAddUser = () => {
  //   const userToAdd = allUsers.find((u) => u.id === selectedNewUser);
  //   if (!userToAdd) return;

  //   if (userToAdd.payRateId && userToAdd.payRateId !== currentTemplate.id) {
  //     setConfirmState({
  //       open: true,
  //       user: userToAdd,
  //       message: `Nhân viên ${userToAdd.name} đã thuộc một mẫu lương khác. Bạn có chắc muốn thay đổi?`,
  //     });
  //   } else {
  //     performAddUser(userToAdd);
  //   }
  // };

  // const handleConfirmAddUser = () => {
  //   if (confirmState.user) {
  //     performAddUser(confirmState.user);
  //   }
  // };

  // const handleRemoveUser = (userId: string) => {
  //   const updatedUsers =
  //     currentTemplate.users?.filter((u) => u.id !== userId) || [];
  //   setCurrentTemplate({
  //     ...currentTemplate,
  //     users: updatedUsers,
  //     totalUser: updatedUsers.length,
  //   });
  // };

  // const handleSave = () => {
  //   onSave(currentTemplate);
  //   onOpenChange(false);
  // };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[90vw] !w-[90vw] !h-[90vh] overflow-y-auto flex flex-col justify-start ">
          <DialogHeader>
            <DialogTitle>Nhân viên áp dụng</DialogTitle>
          </DialogHeader>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Input className="w-100" />
              </PopoverTrigger>

              <PopoverContent className="w-100 p-0">
                <Command>
                  <CommandInput
                    placeholder="Search nhân viên..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
                    <CommandGroup>
                      {allUsers.map((u) => (
                        <CommandItem
                          key={u.id}
                          value={u.name ?? ""}
                          onSelect={(currentValue) => {
                            setValue(currentValue === u.id ? "" : currentValue);
                          }}
                        >
                          {u.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="max-h-[68vh] overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-16">STT</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead className="w-16 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTemplate?.users?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              variant={"ghost"}
              // onClick={handleSave}
            >
              Thêm nhân viên áp dụng
            </Button>
          </div>
          <DialogFooter>
            <Button
            // onClick={handleSave}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <ConfirmationDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        title="Xác nhận thay đổi"
        message={confirmState.message}
        onConfirm={handleConfirmAddUser}
      /> */}
    </>
  );
}
