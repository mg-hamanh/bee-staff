// components/error-handler.tsx

"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner"; // Giả sử bạn đang dùng thư viện sonner, hoặc react-toastify

export function BeeMiddlewareErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      let message = "Có lỗi xảy ra!";
      switch (error) {
        case "future":
          message = "Tính năng này sẽ sớm ra mắt!";
          toast.info(message);
          break;
        case "inactive":
          message = "Tính năng này đã bị vô hiệu hóa.";
          toast.warning(message);
          break;
        case "access_denied":
          message = "Bạn không có quyền truy cập trang này.";
          toast.error(message);
          break;
      }

      // Xóa query param khỏi URL để không bị hiển thị lại khi refresh
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null; // Component này không render ra bất cứ thứ gì
}
