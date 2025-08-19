import { fetchBonusReport } from "@/lib/data"
import { BonusReport } from "@/types/type"
import { useEffect, useState } from "react"

export type VisibleColumns = {
  name: boolean
  sale_id: boolean
  invoices: boolean
  valid_invoices: boolean
  products: boolean
  revenue: boolean
  current_bonus: boolean
  next_target: boolean
  min_target: boolean
  target_percent: boolean
}

export type VisibleColumnKey = keyof VisibleColumns

export interface UseSaleReportReturn {
  data: BonusReport[]
  loading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (v: string) => void
  visibleColumns: VisibleColumns
  toggleColumn: (col: VisibleColumnKey) => void
  exportToExcel: () => void
}

export function useBonusReport(): UseSaleReportReturn {
  const [data, setData] = useState<BonusReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    name: true,
    sale_id: true,
    invoices: true,
    valid_invoices: true,
    products: true,
    revenue: true,
    current_bonus: true,
    next_target: true,
    min_target: true,
    target_percent: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/bonus-report`);
        if (!res.ok) throw new Error("Failed to fetch report");
        const result: BonusReport[] = await res.json();
        setData(result);
        console.log(result);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleColumn = (col: VisibleColumnKey) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const exportToExcel = () => {
    // giữ nguyên logic export
  };

  return {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    visibleColumns,
    toggleColumn,
    exportToExcel,
  };
}

