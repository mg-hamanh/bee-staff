import { UserTable } from "@/components/user/user-table";

export default function Page() {
  return (
    <div className="hidden h-full flex-1 flex-col gap-8  md:flex">
      <UserTable />
    </div>
  );
}
