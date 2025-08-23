"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useUsers } from "@/components/settings/hooks/useUsers";
import { columns } from "@/components/user/columns";

export default function Page() {
  const { users } = useUsers();

  return (
    <div className="hidden h-full flex-1 flex-col gap-8  md:flex">
      <DataTable data={users} columns={columns} />
    </div>
  );
}
