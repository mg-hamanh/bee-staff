import { PaysheetTable } from "@/components/paysheet/paysheet-table";

export default function Page() {
  return (
    <div className="hidden h-full flex-1 flex-col gap-8  md:flex">
      <PaysheetTable />
    </div>
  );
}
