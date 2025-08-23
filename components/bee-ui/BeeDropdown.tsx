"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface BeeDropdown<T> {
  data: T[];
  keyField: keyof T;
  labelField: keyof T;
  placeholder?: string;
  onChange?: (selectedKeys: Array<T[keyof T]>) => void;
}

export default function BeeDropdown<T extends Record<string, unknown>>({
  data,
  keyField,
  labelField,
  placeholder = "Tất cả",
  onChange,
}: BeeDropdown<T>) {
  const [selectedKeys, setSelectedKeys] = useState<Array<T[keyof T]>>([]);

  const allKeys = data.map((item) => item[keyField]);
  const isAllSelected = selectedKeys.length === allKeys.length;

  // Mặc định chọn tất cả khi load lần đầu
  // useEffect(() => {
  //   if (data.length > 0 && selectedKeys.length === 0) {
  //     setSelectedKeys(allKeys);
  //   }
  // }, [data]);

  useEffect(() => {
    onChange?.(selectedKeys);
  }, [selectedKeys]);

  const toggleItem = (key: T[keyof T]) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAll = (checked: boolean) => {
    setSelectedKeys(checked ? allKeys : []);
  };

  const displayLabel =
    isAllSelected || selectedKeys.length === 0
      ? `Tất cả ${placeholder}`
      : `${selectedKeys.length} ${placeholder} đã chọn`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[250px] justify-start text-left">
          {displayLabel}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <ScrollArea className="h-[300px] p-2">
          <div className="space-y-2">
            {/* Chọn tất cả */}
            <div className="flex items-center space-x-2 border-b pb-2 mb-2">
              <Checkbox
                id="check-all"
                checked={isAllSelected}
                onCheckedChange={(checked) => toggleAll(Boolean(checked))}
              />
              <label htmlFor="check-all" className="text-sm font-medium">
                Chọn tất cả
              </label>
            </div>

            {/* Danh sách item */}
            {data.map((item) => {
              const key = item[keyField];
              const label = item[labelField];
              const checkboxId = `item-${String(key)}`;
              return (
                <div key={String(key)} className="flex items-center space-x-2">
                  <Checkbox
                    id={checkboxId}
                    checked={selectedKeys.includes(key)}
                    onCheckedChange={() => toggleItem(key)}
                  />
                  <label htmlFor={checkboxId} className="text-sm">
                    {String(label)}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
