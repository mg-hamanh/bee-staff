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
import { UserUI } from "@/types/type-ui";
import { CreateUser, UpdateUser } from "@/types/type-zod";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface ApiResponse {
  total: number;
  data: UserUI[];
  filter: { id: string; value: string }[];
  pagination: {
    pageCount: number;
    total: number;
    pageIndex: number;
    pageSize: number;
  };
}

// 1. Định nghĩa lại kiểu dữ liệu cho context với các hàm mới
interface UsersContextType {
  users: UserUI[];
  isLoading: boolean;
  error: string | null;
  apiResponse: ApiResponse | null;
  pageCount: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;

  refetch: () => void;
  createUser: (userData: CreateUser) => Promise<void>;
  updateUser: (userId: string, userData: UpdateUser) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

// 2. Tạo Context
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// 3. Component Provider
export function UsersProvider({ children }: { children: ReactNode }) {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  // Hàm để lấy danh sách nhân viên từ API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
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
      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error("Lỗi khi tải danh sách nhân viên");
      const data: ApiResponse = await res.json();
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

  // Hàm để tạo nhân viên mới
  const createUser = useCallback(
    async (userData: CreateUser) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create user");
        }

        toast.success("Tạo nhân viên mới thành công!");
        await fetchData();
      } catch (err) {
        const errorMessage =
          (err as Error).message || "An unknown error occurred";
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData]
  );

  // HÀM MỚI: Cập nhật nhân viên
  const updateUser = useCallback(
    async (userId: string, userData: UpdateUser) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update user");
        }

        toast.success("Cập nhật nhân viên thành công!");
        await fetchData(); // Tải lại danh sách để cập nhật UI
      } catch (err) {
        const errorMessage =
          (err as Error).message || "An unknown error occurred";
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData]
  );

  // HÀM MỚI: Xóa nhân viên
  const deleteUser = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to delete user");
        }

        toast.success("Xóa nhân viên thành công!");
        await fetchData(); // Tải lại danh sách để cập nhật UI
      } catch (err) {
        const errorMessage =
          (err as Error).message || "An unknown error occurred";
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData]
  );

  const value = {
    users: apiResponse?.data || [],
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
    createUser,
    updateUser,
    deleteUser, // Thêm hàm mới vào context
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

// 4. Hook tùy chỉnh để sử dụng context
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
