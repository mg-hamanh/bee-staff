import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Settings2, Download } from "lucide-react";
import { VisibleColumnKey, VisibleColumns } from "./hooks/useBonusReport";

interface DashboardToolbarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  visibleColumns: VisibleColumns;
  toggleColumn: (col: VisibleColumnKey) => void;
  exportToExcel: () => void;
}

export function DashboardToolbar({
  searchTerm,
  setSearchTerm,
  visibleColumns,
  toggleColumn,
  exportToExcel,
}: DashboardToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* search input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* actions */}
      <div className="flex items-center gap-2">
        {/* columns toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(visibleColumns) as VisibleColumnKey[]).map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={visibleColumns[col]}
                onCheckedChange={() => toggleColumn(col)}
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* export */}
        <Button variant="outline" size="sm" onClick={exportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );
}
