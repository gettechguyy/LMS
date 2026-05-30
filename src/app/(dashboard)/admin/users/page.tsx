"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/panels/data-table";
import { RoleBadge, StatusBadge } from "@/components/panels/role-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { MOCK_ADMIN_USERS } from "@/lib/data/mock-panels";
import type { UserRole } from "@/types";

interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: string;
  created_at: string;
}

async function fetchUsers(search: string): Promise<AdminUser[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const res = await fetch(`/api/admin/users?${params}`);
  if (!res.ok) {
    return MOCK_ADMIN_USERS.filter(
      (u) =>
        !search ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
  }
  const json = await res.json();
  return json.data?.length ? json.data : MOCK_ADMIN_USERS;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => fetchUsers(search),
  });

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (isLoading) return <LoadingSkeleton variant="dashboard" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Search, review, and manage platform users."
      />

      <DataTable
        title="All users"
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        columns={[
          {
            key: "user",
            header: "User",
            cell: (row) => (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="gradient-primary text-xs text-white">
                    {getInitials(row.first_name, row.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{row.first_name} {row.last_name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            cell: (row) => <RoleBadge role={row.role} />,
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "joined",
            header: "Joined",
            cell: (row) => (
              <span className="text-muted-foreground">
                {new Date(row.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-12",
            cell: () => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit role</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />
    </div>
  );
}
