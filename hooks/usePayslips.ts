import { useState, useEffect } from "react";
import { PaysheetUI, PayslipUI } from "@/types/type-ui";
import api from "@/lib/api-client";

const cache = new Map();

export const usePayslips = (paysheetId: string | undefined) => {
  const [data, setData] = useState<PayslipUI[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paysheetId) {
      return;
    }

    if (cache.has(paysheetId)) {
        setData(cache.get(paysheetId));
        return;
    }

    const fetchPayslips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<PaysheetUI>(`/paysheets/${paysheetId}`);

        cache.set(paysheetId, response.data.payslips);
        setData(response.data.payslips);
      } catch (err) {
        setError("Không thể tải dữ liệu phiếu lương.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayslips();
  }, [paysheetId]);

  return { data, isLoading, error };
};