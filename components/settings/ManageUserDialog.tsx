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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { PayRateTemplateUI } from "@/types/type-ui";
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

interface ManageUsersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateToEdit: PayRateTemplateUI | null;
}

export function ManageUsersDialog({
  isOpen,
  onOpenChange,
  templateToEdit,
}: ManageUsersDialogProps) {
  const { users: allUsers } = useUsers();
  const [currentTemplate, setCurrentTemplate] =
    useState<PayRateTemplateUI | null>(templateToEdit);

  useEffect(() => {
    setCurrentTemplate(templateToEdit);
  }, [templateToEdit]);

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
                        <CommandItem key={u.id} value={u.name ?? ""}>
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
    </>
  );
}
