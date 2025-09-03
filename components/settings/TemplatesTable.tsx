// /app/admin/settings/components/TemplatesTable.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { TemplateFormDialog } from "./TemplateFormDialog";
import { PayRateTemplateUI } from "@/types/type-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { emptyTemplate } from "@/constants/bonus-desc";
import { ManageUsersDialog } from "./ManageUserDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTemplates } from "@/context/TemplatesProvider";

export default function TemplatesTable() {
  const { templates, deleteTemplate } = useTemplates();
  const [editingTemplate, setEditingTemplate] =
    useState<PayRateTemplateUI | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [userForm, setUserForm] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Chi tiết</Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto flex flex-col justify-start p-0 rounded-lg">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Danh sách mẫu thưởng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow>
                  <TableHead className="px-4 py-2 text-left">Tên mẫu</TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Người dùng
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id} className="border-t">
                    <TableCell className="px-4 py-2">{t.name}</TableCell>
                    <TableCell className="px-4 py-2">
                      {t.totalUser ?? 0}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTemplate(t);
                          setOpenForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTemplate(t);
                          setUserForm(true);
                        }}
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTemplate(t.id!)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TemplateFormDialog
            isOpen={openForm}
            onOpenChange={() => {
              setEditingTemplate(null);
              setOpenForm(false);
            }}
            templateToEdit={editingTemplate}
          />

          <ManageUsersDialog
            isOpen={userForm}
            onOpenChange={() => {
              setEditingTemplate(null);
              setUserForm(false);
            }}
            templateToEdit={editingTemplate}
          />
        </div>
        <DialogFooter className="py-2 px-6 bg-white border-t">
          <div className="w-full flex flex-row items-center justify-between">
            <Button
              onClick={() => {
                setEditingTemplate(emptyTemplate);
                setOpenForm(true);
              }}
            >
              Thêm mẫu mới
            </Button>
            <Button type="button" variant="outline">
              Xong
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
