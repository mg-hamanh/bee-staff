"use client";

import { CalendarIcon, CheckIcon, PlusIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { periods } from "./data";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePaysheet, createPaysheetSchema } from "@/types/type-zod";
import dayjs from "dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { workingPeriodUI } from "@/types/type-ui";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CommandEmpty, CommandGroup } from "cmdk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { useUsers } from "@/context/UsersProvider";
import { usePaysheets } from "@/context/PaysheetContext";

export function PaysheetAddDialog() {
  const { users } = useUsers();
  const { createPaysheet: createPaysheetAction } = usePaysheets();

  const [workingPeriods, setWorkingPeriods] = useState<workingPeriodUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePaysheet>({
    resolver: zodResolver(createPaysheetSchema),
    defaultValues: {
      periodId: "1",
      periodName: "",
      startTime: "",
      endTime: "",
      scope: "all",
      employeeIds: [],
    },
  });

  const { reset } = form;

  const watchedPeriodId = form.watch("periodId");
  const startDate = form.watch("startTime");
  const endDate = form.watch("endTime");
  const scope = form.watch("scope");
  const selectedEmployeeIds = form.watch("employeeIds");

  const selectedEmployees = users.filter((emp) =>
    selectedEmployeeIds?.includes(emp.id)
  );

  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        const res = await fetch("/api/paysheets/generate-working-period");
        if (!res.ok) {
          throw new Error("Failed to fetch workingPeriods");
        }
        const data = await res.json();
        const periodsData: workingPeriodUI[] = data.data;
        setWorkingPeriods(periodsData);

        // Cập nhật defaultValues cho form sau khi có dữ liệu
        if (periodsData.length > 2) {
          reset({
            periodId: "1",
            periodName: periodsData[2].name,
            startTime: dayjs(periodsData[2].startTime).format("YYYY-MM-DD"),
            endTime: dayjs(periodsData[2].endTime).format("YYYY-MM-DD"),
            scope: "all",
            employeeIds: [],
          });
        }
      } catch (err) {
        console.error(err);
        // Có thể thêm state để hiển thị lỗi cho người dùng
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriod();
  }, [reset]);

  const onSubmit = async (values: CreatePaysheet) => {
    setIsSubmitting(true);
    try {
      // Gọi đúng hàm createPaysheetAction từ context
      await createPaysheetAction(values);
      // setOpen(false); // Đóng dialog khi thành công
      form.reset(); // Reset lại form

      // Toast success đã có sẵn trong hàm createPaysheetAction của context rồi
      // nên không cần gọi lại ở đây.
    } catch (error) {
      // Toast error cũng đã được xử lý trong context
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SỬA 5: Sử dụng state isLoading để hiển thị nút chờ tải
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <PlusIcon className="size-4 mr-2" />
        Bảng tính thưởng
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="responsive">
          <PlusIcon className="size-4" />
          <div className="hidden lg:inline">Bảng tính thưởng</div>
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto flex flex-col justify-start p-0 rounded-lg">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thêm bảng tính thưởng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-row items-center justify-between">
                <Label className="w-40">Kỳ hạn trả lương</Label>
                <FormField
                  control={form.control}
                  name="periodId"
                  render={({ field }) => (
                    <FormItem className="flex-1 flex flex-col">
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);

                            if (value === "1" && workingPeriods.length > 2) {
                              const firstPeriod = workingPeriods[2];
                              form.setValue("periodName", firstPeriod.name);
                              form.setValue(
                                "startTime",
                                dayjs(firstPeriod.startTime).format(
                                  "YYYY-MM-DD"
                                )
                              );
                              form.setValue(
                                "endTime",
                                dayjs(firstPeriod.endTime).format("YYYY-MM-DD")
                              );
                            } else if (value === "2") {
                              form.setValue(
                                "startTime",
                                dayjs().format("YYYY-MM-DD")
                              );
                              form.setValue(
                                "endTime",
                                dayjs().format("YYYY-MM-DD")
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {periods.map((p) => (
                              <SelectItem key={p.value} value={String(p.value)}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {watchedPeriodId === "1" && (
                <div className="flex flex-row items-center justify-between">
                  <Label className="w-40">Kỳ làm việc</Label>
                  <FormField
                    control={form.control}
                    name="periodName"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormControl className="w-full">
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedPeriod = workingPeriods.find(
                                (p) => p.name === value
                              );
                              if (selectedPeriod) {
                                // SỬA 2: Cập nhật state form với string "YYYY-MM-DD"
                                form.setValue(
                                  "startTime",
                                  dayjs(selectedPeriod.startTime).format(
                                    "YYYY-MM-DD"
                                  )
                                );
                                form.setValue(
                                  "endTime",
                                  dayjs(selectedPeriod.endTime).format(
                                    "YYYY-MM-DD"
                                  )
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {workingPeriods.map((p) => (
                                <SelectItem key={p.id} value={p.name}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {watchedPeriodId === "2" && (
                <div className="flex flex-row items-center justify-between">
                  <Label className="w-40">Kỳ làm việc từ</Label>
                  <div className="flex-1 flex flex-row items-center justify-between gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    " pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    dayjs(field.value).format("DD/MM/YYYY")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                // Chuyển string từ form state thành Date cho Calendar
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                // Chuyển Date từ Calendar thành string để lưu vào form state
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? dayjs(date).format("YYYY-MM-DD") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date > new Date(endDate) ||
                                  date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <span>đến</span>
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    " pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    dayjs(field.value).format("DD/MM/YYYY")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? dayjs(date).format("YYYY-MM-DD") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date < new Date(startDate) ||
                                  date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-row items-center justify-between">
                <Label className="w-40">Phạm vi áp dụng</Label>
                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem className="flex flex-1">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "all") {
                              form.setValue("employeeIds", []);
                            }
                          }}
                          defaultValue={field.value}
                          className="flex flex-row w-full space-x-2"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="all" id="r1" />
                            <Label htmlFor="r1">Tất cả nhân viên</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="optional" id="r2" />
                            <Label htmlFor="r2">Tùy chọn</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {scope === "optional" && (
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="employeeIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className=" justify-start"
                              >
                                {selectedEmployees.length > 0
                                  ? `${selectedEmployees.length} nhân viên đã chọn`
                                  : "Chọn nhân viên..."}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Tìm nhân viên..." />
                              <CommandList>
                                <CommandEmpty>
                                  Không tìm thấy nhân viên.
                                </CommandEmpty>
                                <ScrollArea
                                  className="h-[200px]"
                                  onWheel={(e) => e.stopPropagation()}
                                >
                                  <CommandGroup>
                                    {users.map((employee) => {
                                      const isSelected = (
                                        field.value || []
                                      ).includes(employee.id);
                                      return (
                                        <CommandItem
                                          key={employee.id}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onSelect={() => {
                                            if (isSelected) {
                                              field.onChange(
                                                (field.value || []).filter(
                                                  (id: string) =>
                                                    id !== employee.id
                                                )
                                              );
                                            } else {
                                              field.onChange([
                                                ...(field.value || []),
                                                employee.id,
                                              ]);
                                            }
                                          }}
                                        >
                                          <div
                                            className={cn(
                                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                              isSelected
                                                ? "bg-primary"
                                                : "opacity-50 [&_svg]:invisible"
                                            )}
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "h-4 w-4 text-white"
                                              )}
                                            />
                                          </div>

                                          <span>{employee.name}</span>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <ScrollArea className="h-[50vh]">
                    <Table>
                      <TableHeader className="bg-primary/5">
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>Tên nhân viên</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-red-100 cursor-pointer"
                                onClick={() => {
                                  if (
                                    selectedEmployeeIds &&
                                    selectedEmployeeIds?.length > 0
                                  ) {
                                    form.setValue(
                                      "employeeIds",

                                      selectedEmployeeIds.filter(
                                        (id: string) => id !== employee.id
                                      )
                                    );
                                  }
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </div>

            <DialogFooter className="py-2 px-6 bg-white border-t">
              <Button type="button" variant="outline">
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
