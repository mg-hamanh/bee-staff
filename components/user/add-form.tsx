"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, CameraIcon, ChevronDown, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UpdateUserSchema,
  CreateUser,
  UpdateUser,
  CreateUserSchema,
} from "@/types/type-zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PayRateTemplateUI, UserTabValue } from "@/types/type-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { BonusType } from "../settings/BonusType";
import { BonusMode } from "../settings/BonusMode";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import BeeHTMLTooltip from "../bee-ui/BeeHTMLTooltip";
import { useTemplates } from "@/context/TemplatesProvider";

interface UserDialogProps {
  user?: UpdateUser | null;
  userTab: UserTabValue;
  onSubmit: (data: CreateUser | UpdateUser) => void | Promise<void>;
  trigger?: React.ReactNode;
}

export function UserDialog({
  user,
  userTab,
  trigger,
  onSubmit,
}: UserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<UserTabValue>(userTab);
  const [expand, setExpand] = React.useState(false);
  const [template, setTemplate] = React.useState<PayRateTemplateUI | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { templates } = useTemplates();

  // Determine the form's mode
  const isEditing = !!user?.id;
  const schema = isEditing ? UpdateUserSchema : CreateUserSchema;

  // Correctly define default values based on the mode
  const defaultValues = React.useMemo(
    () =>
      isEditing
        ? {
            id: user!.id,
            username: user?.username ?? "",
            name: user?.name ?? "",
            email: user?.email ?? "",
            mobile: user?.mobile ?? "",
            depots: user?.depots ?? [],
            image: user?.image ?? null,
            role: user?.role ?? "seller",
            isActive: user?.isActive ?? true,
            payRateId: user?.payRateId ?? "",
          }
        : {
            username: "",
            name: "",
            email: "",
            mobile: "",
            depots: [],
            image: null,
            role: "seller" as const,
            isActive: true,
            payRateId: "",
          },
    [user, isEditing]
  );

  // Pass the correct types to useForm
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (user?.payRateId) {
      const foundTemplate = templates.find((t) => t.id === user.payRateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
      }
    } else {
      setTemplate(null);
    }
  }, [user, templates]);

  const resetDialogState = () => {
    setTab("info");
    setExpand(false);
    setTemplate(null);
    form.reset();
  };

  const handleFormSubmit = async (data: CreateUser | UpdateUser) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      setOpen(false);
      resetDialogState();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetDialogState();
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditing ? "default" : "outline"}
            size={isEditing ? "sm" : "responsive"}
          >
            {isEditing ? (
              <>Cập nhật</>
            ) : (
              <>
                <PlusIcon className="size-4" />
                <div className="hidden lg:inline">Nhân viên</div>
              </>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-[90vw] !w-[90vw] overflow-y-auto flex flex-col justify-start p-0 rounded-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="flex flex-1 flex-col"
          >
            <div className="flex-1">
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as UserTabValue)}
                className="flex flex-1"
              >
                <TabsList className="bg-white px-6">
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger
                    value="payRate"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Thiết lập thưởng
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 bg-accent ">
                  <div className="flex p-6 gap-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center w-30 h-30 bg-white rounded-lg shadow">
                        <CameraIcon />
                      </div>
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() =>
                          toast.info(
                            "Tính năng này sẽ được cập nhật trong tương lai."
                          )
                        }
                      >
                        Chọn ảnh
                      </Button>
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col bg-white p-4 shadow rounded-lg gap-4">
                        <span className="font-bold">Thông tin khởi tạo</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <div className="flex flex-row items-center">
                                  <FormLabel className="w-50">
                                    Tên nhân viên
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <div className="flex flex-row items-center">
                                  <FormLabel className="w-50">Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="depots"
                            render={({ field }) => (
                              <FormItem className="flex">
                                <FormLabel className="w-50">
                                  Chi nhánh làm việc
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={
                                      Array.isArray(field.value)
                                        ? field.value.join(", ")
                                        : ""
                                    }
                                    className="w-full"
                                    placeholder="Để trống để áp dụng cho tất cả cửa hàng"
                                    onChange={(e) => {
                                      const stringValue = e.target.value;
                                      const arrayValue = stringValue
                                        .split(",")
                                        .map((item) => Number(item.trim()))
                                        .filter((item) => !isNaN(item));
                                      field.onChange(arrayValue);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem className="flex">
                                <FormLabel className="w-50">Chức vụ</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Chọn chức vụ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="seller">
                                        Nhân viên bán hàng
                                      </SelectItem>
                                      <SelectItem value="cashier">
                                        Thu ngân
                                      </SelectItem>
                                      <SelectItem value="leader">
                                        Trưởng nhóm
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-40 cursor-pointer"
                        onClick={() => setExpand(!expand)}
                      >
                        {expand ? "Ẩn thông tin" : "Thêm thông tin"}
                        <ChevronDown className={expand ? "rotate-180" : ""} />
                      </Button>
                      {expand && (
                        <div className="flex flex-col bg-white p-4 shadow rounded-lg gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem className="flex">
                                  <FormLabel className="w-50">
                                    Tên đăng nhập
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mobile"
                              render={({ field }) => (
                                <FormItem className="flex">
                                  <FormLabel className="w-50">
                                    Số điện thoại
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {isEditing && (
                              <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Trạng thái
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payRate" className="space-y-4 bg-accent ">
                  <div className="flex flex-col px-6 py-4 gap-4 w-full">
                    <div className="flex flex-row items-center bg-white p-4 shadow rounded-lg gap-4">
                      <span className="text-md font-semibold">Mẫu lương</span>
                      <FormField
                        control={form.control}
                        name="payRateId"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(value) => {
                                const temp = templates.find(
                                  (t) => t.id === value
                                );
                                setTemplate(temp as PayRateTemplateUI);
                                field.onChange(value);
                              }}
                              value={field.value || ""}
                            >
                              <SelectTrigger className="w-[400px]">
                                <SelectValue placeholder="Chọn mẫu lương có sẵn" />
                              </SelectTrigger>
                              <SelectContent>
                                {templates.map((t) => (
                                  <SelectItem key={t.id} value={t.id}>
                                    {t.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {template && (
                      <div className="flex flex-col bg-white rounded-lg px-4 py-8 gap-6">
                        <div className="flex flex-row items-center justify-between">
                          <div>
                            <h3 className="font-medium">Thưởng</h3>
                            <p className="text-sm text-muted-foreground">
                              Thiết lập thưởng theo doanh thu cho nhân viên
                            </p>
                          </div>
                          <Switch
                            checked={template.bonusTemplates?.[0]?.status}
                            disabled
                          />
                        </div>
                        {template.bonusTemplates?.[0]?.status && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                              <span>Loại thưởng</span>
                              <BonusType
                                type={template.bonusTemplates?.[0].type ?? 0}
                                onChange={() => {}}
                                readonly={true}
                              />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span>Hình thức</span>
                                <BeeHTMLTooltip
                                  content={
                                    template.bonusTemplates?.[0].description
                                  }
                                />
                              </div>
                              <BonusMode
                                mode={template.bonusTemplates?.[0].mode ?? 0}
                                onChange={() => {}}
                                readonly={true}
                              />
                            </div>
                          </div>
                        )}

                        {template.bonusTemplates?.[0]?.status && (
                          <>
                            <Table>
                              <TableHeader className="bg-gray-50">
                                <TableRow>
                                  <TableHead className="font-medium">
                                    Loại hình
                                  </TableHead>
                                  <TableHead className="font-medium">
                                    Doanh thu
                                  </TableHead>
                                  <TableHead className="font-medium">
                                    Thưởng
                                  </TableHead>
                                  <TableHead className="w-16"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {template.bonusTemplates?.[0].bonusLevels?.map(
                                  (level) => (
                                    <TableRow key={level.id || level.clientId}>
                                      <TableCell>Tư vấn bán hàng</TableCell>
                                      <TableCell>
                                        <Input
                                          type="text"
                                          value={level.amount ?? 0}
                                          readOnly
                                          className="w-40"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="number"
                                            step="0.1"
                                            value={level.bonus ?? 0}
                                            readOnly
                                            className="w-24"
                                          />
                                          <span className="text-sm text-muted-foreground">
                                            %
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {(template.bonusTemplates?.[0]
                                          .bonusLevels?.length ?? 0) > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                            <div className="border-t p-1">
                              <Button
                                variant="ghost"
                                className="text-primary"
                                disabled
                              >
                                Thêm thưởng
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="py-2 px-6 bg-white border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Bỏ qua
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
