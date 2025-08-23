"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CircleAlert, Trash2 } from "lucide-react";
import { BonusType } from "./BonusType";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BonusMode } from "./BonusMode";
import { BONUS_DESCRIPTIONS } from "@/constants/bonus-desc";
import { toast } from "sonner";
import { BonusLevelUI, PayRateTemplateUI } from "@/types/type-ui";
import { useTemplates } from "./context/TemplatesProvider";

interface TemplateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateToEdit: PayRateTemplateUI | null;
}

const formatNumber = (num: number) => num.toLocaleString("vi-VN");
const parseNumber = (str: string) => Number(str.replace(/[^\d]/g, ""));

export function TemplateFormDialog({
  isOpen,
  onOpenChange,
  templateToEdit,
}: TemplateFormDialogProps) {
  const { createTemplate, updateTemplate } = useTemplates();
  const [template, setTemplate] = useState<PayRateTemplateUI | null>(
    templateToEdit
  );

  useEffect(() => {
    setTemplate(templateToEdit);
  }, [templateToEdit]);

  if (!template) return null;

  const handleFieldChange = <K extends keyof PayRateTemplateUI>(
    field: K,
    value: PayRateTemplateUI[K]
  ) => {
    setTemplate((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateLevel = <K extends keyof BonusLevelUI>(
    bonusKey: string,
    levelKey: string,
    field: K,
    value: BonusLevelUI[K]
  ) => {
    setTemplate((prev) => {
      if (!prev) return prev;

      const updatedBonusTemplates = prev.bonusTemplates?.map((bt) =>
        bt.id === bonusKey || bt.clientId === bonusKey
          ? {
              ...bt,
              bonusLevels: bt.bonusLevels?.map((l) =>
                l.id === levelKey || l.clientId === levelKey
                  ? { ...l, [field]: value }
                  : l
              ),
            }
          : bt
      );

      return { ...prev, bonusTemplates: updatedBonusTemplates };
    });
  };

  const updateBonusTemplate = <
    K extends keyof NonNullable<PayRateTemplateUI["bonusTemplates"]>[number]
  >(
    bonusKey: string,
    field: K,
    value: NonNullable<PayRateTemplateUI["bonusTemplates"]>[number][K]
  ) => {
    setTemplate((prev) => {
      if (!prev) return prev;

      const updatedBonusTemplates = prev.bonusTemplates?.map((bt) =>
        bt.id === bonusKey || bt.clientId === bonusKey
          ? { ...bt, [field]: value }
          : bt
      );

      return { ...prev, bonusTemplates: updatedBonusTemplates };
    });
  };

  const addLevel = (bonusKey: string) => {
    setTemplate((prev) => {
      if (!prev) return prev;

      const updatedBonusTemplates = prev.bonusTemplates?.map((bt) =>
        bt.id === bonusKey || bt.clientId === bonusKey
          ? {
              ...bt,
              bonusLevels: [
                ...(bt.bonusLevels ?? []),
                {
                  clientId: Date.now().toString(),
                  unit: "PERCENT" as const,
                  bonus: 0,
                  amount: 0,
                },
              ],
            }
          : bt
      );

      return { ...prev, bonusTemplates: updatedBonusTemplates };
    });
  };

  const removeLevel = (bonusKey: string, levelKey: string) => {
    setTemplate((prev) => {
      if (!prev) return prev;

      const updatedBonusTemplates = prev.bonusTemplates?.map((bt) =>
        (bt.id === bonusKey || bt.clientId === bonusKey) &&
        (bt.bonusLevels?.length ?? 0) > 1
          ? {
              ...bt,
              bonusLevels: bt.bonusLevels?.filter(
                (l: BonusLevelUI) =>
                  l.id !== levelKey && l.clientId !== levelKey
              ),
            }
          : bt
      );

      return { ...prev, bonusTemplates: updatedBonusTemplates };
    });
  };

  const handleSave = () => {
    if (!template.name || template.name.trim() === "") {
      toast.error("Tên mẫu không được để trống");
      return;
    }

    for (const bt of template.bonusTemplates ?? []) {
      if (!bt.bonusLevels || bt.bonusLevels.length === 0) {
        toast.error("Phải tạo ít nhất 1 mức thưởng");
        return;
      }
    }

    const cleanTemplate: PayRateTemplateUI = {
      ...template,
      bonusTemplates: template.bonusTemplates?.map((bt) => ({
        ...bt,
        bonusLevels: bt.bonusLevels?.map(
          ({ clientId: _clientId, ...rest }) => rest
        ),
      })),
    };

    if (template.id) {
      updateTemplate(template.id, cleanTemplate);
    } else {
      createTemplate(cleanTemplate);
    }
    onOpenChange(false);
  };

  const handleBonusTemplateChange = (
    bonusKey: string,
    field: "mode" | "type",
    value: number
  ) => {
    setTemplate((prev) => {
      if (!prev) return prev;

      const updatedBonusTemplates = prev.bonusTemplates?.map((bt) => {
        if (bt.id !== bonusKey && bt.clientId !== bonusKey) return bt;

        // cập nhật field
        const updatedBt = { ...bt, [field]: value };

        // tìm description theo mode & type
        const desc =
          BONUS_DESCRIPTIONS.find(
            (d) => d.mode === updatedBt.mode && d.type === updatedBt.type
          )?.description ?? "";

        return { ...updatedBt, description: desc };
      });

      return { ...prev, bonusTemplates: updatedBonusTemplates };
    });
  };

  const bonusTemplate = template.bonusTemplates?.[0];
  const currentDesc = bonusTemplate?.description ?? "Chưa có mô tả";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[90vw] !h-[90vh] overflow-y-auto flex flex-col justify-start p-0">
        <DialogHeader className="p-4">
          <DialogTitle>
            {template.id ? "Chỉnh sửa mẫu" : "Thêm mẫu mới áp dụng"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col px-10 py-4 bg-primary/5 gap-4">
          <div className="flex items-center gap-10 p-4 bg-white rounded-lg">
            <Label htmlFor="name">Mẫu áp dụng</Label>
            <Input
              id="name"
              value={template.name ?? ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="VD: Mẫu lương nhân viên hành chính"
              className="max-w-100"
            />
          </div>

          <div className="flex flex-col bg-white rounded-lg px-4 py-8 gap-6">
            <div className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-medium">Thưởng</h3>
                <p className="text-sm text-muted-foreground">
                  Thiết lập thưởng theo doanh thu cho nhân viên
                </p>
              </div>
              <Switch
                checked={bonusTemplate?.status}
                onCheckedChange={(checked) => {
                  updateBonusTemplate(
                    bonusTemplate?.id ?? bonusTemplate?.clientId ?? "",
                    "status",
                    checked
                  );
                }}
              />
            </div>
            {bonusTemplate?.status && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span>Loại thưởng</span>
                  <BonusType
                    type={bonusTemplate?.type ?? 0}
                    onChange={(t) => {
                      handleBonusTemplateChange(
                        bonusTemplate?.id ?? bonusTemplate.clientId ?? "",
                        "type",
                        t
                      );
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span>Hình thức</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleAlert className="h-5 w-5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div
                          dangerouslySetInnerHTML={{ __html: currentDesc }}
                        />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <BonusMode
                    mode={bonusTemplate?.mode ?? 0}
                    onChange={(m) => {
                      handleBonusTemplateChange(
                        bonusTemplate?.id ?? bonusTemplate.clientId ?? "",
                        "mode",
                        m
                      );
                    }}
                  />
                </div>
              </div>
            )}

            {bonusTemplate?.status && (
              <>
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
                    {bonusTemplate?.bonusLevels?.map((level) => (
                      <TableRow key={level.id || level.clientId}>
                        <TableCell>Tư vấn bán hàng</TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={formatNumber(level.amount ?? 0)}
                            onChange={(e) =>
                              updateLevel(
                                bonusTemplate.id ??
                                  bonusTemplate.clientId ??
                                  "",
                                level.clientId || level.id || "",
                                "amount",
                                parseNumber(e.target.value)
                              )
                            }
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              value={level.bonus ?? 0}
                              onChange={(e) =>
                                updateLevel(
                                  bonusTemplate.id ??
                                    bonusTemplate.clientId ??
                                    "",
                                  level.clientId || level.id || "",
                                  "bonus",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {(bonusTemplate.bonusLevels?.length ?? 0) > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeLevel(
                                  bonusTemplate.id ??
                                    bonusTemplate.clientId ??
                                    "",
                                  level.id ?? level.clientId ?? ""
                                )
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    className="text-primary"
                    onClick={() =>
                      addLevel(bonusTemplate.id ?? bonusTemplate.clientId ?? "")
                    }
                  >
                    Thêm thưởng
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col bg-white rounded-lg px-4 py-8 gap-6">
            <div className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-medium">Giảm trừ</h3>
                <p className="text-sm text-muted-foreground">
                  Thiết lập khoản giảm trừ như đi muộn, về sớm, vi phạm nội
                  quy,...
                </p>
              </div>
              <Switch
                checked={false}
                onCheckedChange={() => {
                  toast.info("Sẽ có trong bản cập nhật sắp tới.");
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-row items-center justify-end gap-4 py-2 px-8">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Bỏ qua
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lưu
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
