// file: providers/PaysheetsProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { PaysheetTotalRow, PaysheetUI } from "@/types/type-ui";
import { CreatePaysheet } from "@/types/type-zod";

interface GetPaysheetsApiResponse {
  totalRow: PaysheetTotalRow;
  total: number;
  data: PaysheetUI[];
  filter: { id: string; value: string }[];
  pagination: {
    pageCount: number;
    total: number;
    pageIndex: number;
    pageSize: number;
  };
}

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU MÀ CONTEXT SẼ CUNG CẤP
// (Lấy từ object 'return' của hook cũ)
interface PaysheetsContextType {
  paysheets: PaysheetUI[];
  totalRow: PaysheetTotalRow | undefined;
  isLoading: boolean;
  error: string | null;
  apiResponse: GetPaysheetsApiResponse | null;
  pageCount: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  refetch: () => void;
  createPaysheet: (data: CreatePaysheet) => Promise<void>;
}

// 2. TẠO CONTEXT
const PaysheetsContext = createContext<PaysheetsContextType | undefined>(
  undefined
);

// 3. TẠO COMPONENT PROVIDER
export function PaysheetsProvider({ children }: { children: ReactNode }) {
  // ✅ Toàn bộ logic từ hook usePaysheetLogic được đặt ở đây
  const [apiResponse, setApiResponse] =
    useState<GetPaysheetsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleSetColumnFilters: React.Dispatch<
    React.SetStateAction<ColumnFiltersState>
  > = (updater) => {
    setColumnFilters((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPagination((p) => ({ ...p, pageIndex: 0 }));
      return next;
    });
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();

    params.set("pageIndex", String(pagination.pageIndex));
    params.set("pageSize", String(pagination.pageSize));

    if (sorting.length > 0) {
      const sortItem = sorting[0];
      params.set("sort", `${sortItem.id} ${sortItem.desc ? "desc" : "asc"}`);
    }

    columnFilters.forEach((filter) => {
      const filterId = filter.id;
      const filterValue = filter.value;
      if (filterValue) {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          params.set(filterId, filterValue.join(","));
        } else if (typeof filterValue === "string") {
          params.set(filterId, filterValue);
        }
      }
    });

    try {
      const response = await fetch(`/api/paysheets?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu bảng lương");
      }
      const data: GetPaysheetsApiResponse = await response.json();
      setApiResponse(data);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error(`Lỗi: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, columnFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createPaysheet = useCallback(
    async (data: CreatePaysheet) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/paysheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Tạo bảng lương thất bại");
        }

        toast.success("Tạo bảng lương thành công!");
        await fetchData(); // Gọi lại fetchData sau khi tạo
      } catch (err) {
        const errorMessage = (err as Error).message || "Có lỗi không xác định";
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData]
  );

  // Gom tất cả state và hàm vào một object 'value'
  const value = {
    paysheets: apiResponse?.data || [],
    totalRow: apiResponse?.totalRow,
    isLoading,
    error,
    apiResponse,
    pageCount: apiResponse?.pagination.pageCount ?? 0,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters: handleSetColumnFilters,
    refetch: fetchData,
    createPaysheet,
  };

  return (
    <PaysheetsContext.Provider value={value}>
      {children}
    </PaysheetsContext.Provider>
  );
}

// 4. TẠO HOOK ĐỂ DÙNG CONTEXT DỄ DÀNG HƠN
export const usePaysheets = () => {
  const context = useContext(PaysheetsContext);
  if (context === undefined) {
    throw new Error("usePaysheets must be used within a PaysheetsProvider");
  }
  return context;
};
