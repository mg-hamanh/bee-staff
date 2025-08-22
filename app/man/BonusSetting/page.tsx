// /app/admin/settings/page.tsx

import { TemplatesProvider } from "@/components/settings/context/TemplatesProvider";
import TemplatesTable from "@/components/settings/TemplatesTable";

export default function Page() {
  return (
    <TemplatesProvider>
      <TemplatesTable />
    </TemplatesProvider>
  );
}
