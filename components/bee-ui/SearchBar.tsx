import { Input } from "@/components/ui/input";
import { Search, Settings2, X } from "lucide-react";
import { useState } from "react";

type expandData = {
  placeholder?: string;
  columns?: string;
};

type SearchBarProps = {
  placeholder?: string;
  expandable?: boolean;
  expandData?: expandData[];
  onSearch: (value: string) => void;
};

export default function SearchBar({
  placeholder = "Search...",
  expandable = false,
  expandData = [],
  onSearch,
}: SearchBarProps) {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="relative flex items-center">
      <Input
        className={` bg-white w-100 rounded-lg pl-9 ${
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
