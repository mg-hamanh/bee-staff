import { Loader2 } from "lucide-react";
import { useBonusReport } from "./hooks/useBonusReport";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardTable } from "./DashboardTable";

export function AdminDashboard() {
  const {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    visibleColumns,
    toggleColumn,
    exportToExcel,
  } = useBonusReport();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        exportToExcel={exportToExcel}
      />
      <DashboardTable data={data} visibleColumns={visibleColumns} />
    </div>
  );
}
