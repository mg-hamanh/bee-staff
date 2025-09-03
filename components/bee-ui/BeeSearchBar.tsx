"use client";

import { Input } from "@/components/ui/input";
import { Search, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

type expandData = {
  placeholder?: string;
  columns?: string;
};

type SearchBarProps = {
  value: string;
  placeholder?: string;
  expandable?: boolean;
  expandData?: expandData[];
  onSearch: (value: string) => void;
};

export default function BeeSearchBar({
  value,
  placeholder = "Search...",
  expandable = false,
  onSearch,
}: SearchBarProps) {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  return (
    <div className="relative flex items-center">
      <Input
        className={` bg-white h-8 w-[240px] lg:w-[320px] rounded-lg pl-9 ${
          expandable ? "pr-18" : "pr-12"
        }`}
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) {
            onSearch(searchText);
            e.currentTarget.blur();
          }
        }}
      />
      <Search className="h-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
      {searchText && (
        <X
          className={`h-5 absolute ${
            expandable ? "right-8" : "right-2"
          } top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer`}
          onClick={() => {
            setSearchText("");
            onSearch("");
          }}
        />
      )}
      {expandable && (
        <Settings2 className="h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
      )}
    </div>
  );
}
