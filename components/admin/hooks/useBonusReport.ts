'use client'

import { useSession } from "@/context/SessionContext"
import { BonusReport } from "@/types/type"
import { Period } from "@/utils/formatters"
import { useEffect, useState } from "react"

export type VisibleColumns = {
  name: boolean
  saleId: boolean
  invoices: boolean
  validInvoices: boolean
  products: boolean
  revenue: boolean
  currentBonus: boolean
  nextTarget: boolean
  minTarget: boolean
  targetPercent: boolean
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
  const { session } = useSession();
  const [data, setData] = useState<BonusReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState<Period>('month')
  const [depotIds, setDepotIds] =useState<number[]>([])

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    name: true,
    saleId: true,
    invoices: true,
    validInvoices: true,
    products: true,
    revenue: true,
    currentBonus: true,
    nextTarget: true,
    minTarget: true,
    targetPercent: true,
  });

  useEffect(() => {
    if(!session) return;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/bonus-report`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            period,
          }),
        });
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
  }, [period]);

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

