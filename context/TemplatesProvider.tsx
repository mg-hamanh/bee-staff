// /app/admin/settings/context/TemplatesProvider.tsx
"use client";

import { PayRateTemplateUI } from "@/types/type-ui";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";

const TEMPLATES_API_URL = "/api/templates";

type TemplatesContextType = {
  templates: PayRateTemplateUI[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  createTemplate: (t: Partial<PayRateTemplateUI>) => Promise<void>;
  updateTemplate: (id: string, t: Partial<PayRateTemplateUI>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
};

const TemplatesContext = createContext<TemplatesContextType | null>(null);

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PayRateTemplateUI[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(TEMPLATES_API_URL);
      const data = await res.json();

      setTemplates(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách mẫu");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(
    async (template: Partial<PayRateTemplateUI>) => {
      try {
        const res = await fetch(TEMPLATES_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        });
        if (!res.ok) throw new Error("Lỗi khi tạo mẫu");
        toast.success("Mẫu đã được tạo");
        await fetchTemplates();
      } catch (err) {
        console.error(err);
        toast.error("Không thể tạo mẫu");
      }
    },
    [fetchTemplates]
  );

  const updateTemplate = useCallback(
    async (id: string, template: Partial<PayRateTemplateUI>) => {
      try {
        const res = await fetch(`${TEMPLATES_API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        });
        if (!res.ok) throw new Error("Lỗi khi cập nhật mẫu");
        toast.success("Mẫu đã được cập nhật");
        await fetchTemplates();
      } catch (err) {
        console.error(err);
        toast.error("Không thể cập nhật mẫu");
      }
    },
    [fetchTemplates]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${TEMPLATES_API_URL}/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Lỗi khi xóa mẫu");
        toast.success("Mẫu đã bị xóa");
        await fetchTemplates();
      } catch (err) {
        console.error(err);
        toast.error("Không thể xóa mẫu");
      }
    },
    [fetchTemplates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        loading,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
}

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx)
    throw new Error("useTemplates must be used inside TemplatesProvider");
  return ctx;
};
