// /app/admin/settings/hooks/useTemplates.ts
"use client";

import { PayRateTemplateUI } from "@/types/type";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const TEMPLATES_API_URL = "/api/templates";

export function useTemplates() {
  const [templates, setTemplates] = useState<PayRateTemplateUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTemp, setOpenTemp] = useState(false);

  // Lấy danh sách templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(TEMPLATES_API_URL);
      if (!response.ok) throw new Error("Failed to fetch templates");

      const data = await response.json();
      const list = Array.isArray(data) ? data : [data];
      setTemplates(list);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
      toast.error("Không thể tải danh sách mẫu");
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo template mới
  const stripTempIds = (template: Partial<PayRateTemplateUI>) => {
  return {
    ...template,
    bonusTemplates: template.bonusTemplates?.map((bt) => ({
      ...bt,
      id: undefined, // không gửi id
      bonusLevels: bt.bonusLevels?.map((bl) => ({
        ...bl,
        id: undefined, // không gửi id tạm
      })),
    })),
  };
};

const saveTemplate = useCallback(
  async (template: Partial<PayRateTemplateUI>) => {
    try {
      const cleanTemplate = stripTempIds(template);

      const response = await fetch(TEMPLATES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanTemplate),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Mẫu đã được tạo");
        await fetchTemplates();
      } else {
        toast.error(data.error || "Không thể tạo mẫu");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Không thể tạo mẫu");
    }
  },
  [fetchTemplates]
);

// ✅ Cập nhật (PUT /:id)
  const updateTemplate = useCallback(
    async (id: string, template: Partial<PayRateTemplateUI>) => {
      try {
        const response = await fetch(`${TEMPLATES_API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Mẫu đã được cập nhật");
          await fetchTemplates();
        } else {
          toast.error(data.error || "Không thể cập nhật mẫu");
        }
      } catch (error) {
        console.error("Error updating template:", error);
        toast.error("Không thể cập nhật mẫu");
      }
    },
    [fetchTemplates]
  );

  // Xóa template
  const deleteTemplate = useCallback(
    async (id: string) => {
      const template = templates.find((t) => t.id === id);
      if (!template) return;

      if ((template.totalUser ?? 0) > 0) {
        toast.error("Không thể xóa mẫu này vì đã có nhân viên sử dụng.");
        return;
      }

      try {
        const response = await fetch(`${TEMPLATES_API_URL}/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setTemplates((prev) => prev.filter((t) => t.id !== id));
          toast.success("Mẫu đã được xóa");
        } else {
          toast.error(data.error || "Không thể xóa mẫu");
        }
      } catch (error) {
        console.error("Xóa mẫu thất bại:", error);
        toast.error("Không thể xóa mẫu");
      }
    },
    [templates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
    openTemp,
    setOpenTemp,
  };
}
