"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { modes } from "@/constants/bonus-desc";

interface props {
  onChange: (value: number) => void;
  mode: number;
  readonly?: boolean;
}

export function BonusMode({ mode, readonly, onChange }: props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={readonly || false}
        >
          {mode
            ? modes.find((t) => t.value === mode)?.label
            : "Chọn loại thưởng"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {modes.map((t) => (
                <CommandItem
                  key={t.value}
                  value={t.value.toString()}
                  onSelect={(currentValue) => {
                    onChange(Number(currentValue));
                    setOpen(false);
                  }}
                >
                  {t.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      mode === t.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
