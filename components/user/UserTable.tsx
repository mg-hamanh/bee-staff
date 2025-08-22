"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Depot, User } from "@/lib/generated/prisma";
import SearchBar from "../bee-ui/SearchBar";
import { useSession } from "@/context/SessionContext";
import BeeDropdown from "../bee-ui/BeeDropdown";

export default function UserTable() {
  const { session } = useSession();
  const [depots, setDepots] = useState<Depot[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState<number[]>([]);
  const [filterDepot, setFilterDepot] = useState<number[]>([]);

  const roles = [
    { id: 1, name: "Nhân viên bán hàng" },
    { id: 2, name: "Nhân viên Thu ngân" },
    { id: 3, name: "Cửa hàng trưởng" },
  ];

  const PAGE_SIZE = 30;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchText) params.append("q", searchText);
      if (filterRole) params.append("roleName", filterRole.toString());
      if (filterDepot) params.append("depotId", filterDepot.toString());
      params.append("page", page.toString());
      params.append("pageSize", PAGE_SIZE.toString());

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      console.log(data);

      setUsers(data.users);
      setTotalPages(Math.ceil(data.length / PAGE_SIZE));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, filterRole, filterDepot, page]);

  useEffect(() => {
    if (!session) return;
    setDepots(session.depots);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex gap-2 mb-4 items-center justify-between">
        <SearchBar
          placeholder="Tìm theo mã, tên nhân viên"
          onSearch={(e) => {
            setSearchText(e);
          }}
        />
        <div className="flex">
          <BeeDropdown
            data={roles}
            keyField="id"
            labelField="name"
            placeholder="vai trò"
            onChange={(selectedKeys) => {
              setFilterRole(selectedKeys.map(Number));
            }}
          />
          <BeeDropdown
            data={depots}
            keyField="id"
            labelField="name"
            placeholder="chi nhánh"
            onChange={(selectedKeys) => {
              setFilterDepot(selectedKeys.map(Number));
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trờ</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {loading ? "Loading..." : "No users found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => alert(`Edit ${user.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span className="px-3 py-1">{page}</span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
