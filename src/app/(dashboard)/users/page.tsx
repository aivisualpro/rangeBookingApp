/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { toast } from "sonner";
import { HeaderSearchPortal, HeaderActionsPortal } from "@/components/dashboard/header-portal";
import { Input } from "@dashboardpack/core/components/ui/input";
import { UserFormDialog } from "@/components/dashboard/user-form-dialog";

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  user_name: string;
  user_type: string;
  company_id: string;
  company_name: string;
  role: string;
  status: string;
  lastActive: string;
  initials: string;
}

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  suspended: "destructive",
};

export default function UsersPage() {
  const router = useRouter();
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.data) setAllUsers(json.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const deleteTarget = allUsers.find((u) => u.id === deleteUserId);

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {row.original.initials}
          </div>
          <span className="text-sm font-medium">{row.original.name}</span>
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.phone || "—"}</span>
      ),
    },
    {
      accessorKey: "company_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.user_type === "Internal" ? (
            <Badge variant="default" className="text-[10px]">Internal</Badge>
          ) : (
            row.original.company_name || "—"
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status] || "secondary"}
          className="capitalize text-[11px]"
        >
          {row.original.status}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "user_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.user_type === "Internal" ? "default" : "outline"}
          className="capitalize text-[11px]"
        >
          {row.original.user_type}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      meta: { className: "hidden" },
    },
    {
      accessorKey: "lastActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Active" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.lastActive}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      meta: { className: "w-24" },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setEditUser({
                id: row.original.id,
                user_type: row.original.user_type,
                first_name: row.original.first_name,
                last_name: row.original.last_name,
                email: row.original.email,
                phone: row.original.phone,
                user_name: row.original.user_name,
                company_id: row.original.company_id,
                status: row.original.status,
                password: "",
              });
              setFormOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteUserId(row.original.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = allUsers.filter(u =>
    `${u.name} ${u.email} ${u.phone} ${u.company_name}`.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <HeaderSearchPortal>
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-full sm:w-64 bg-background"
        />
      </HeaderSearchPortal>

      <HeaderActionsPortal>
        <Button onClick={() => { setEditUser(null); setFormOpen(true); }} size="sm" className="gap-1.5 h-9">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </HeaderActionsPortal>

      <div className="flex-1 min-h-0 overflow-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          exportFilename="users"
          initialColumnVisibility={{ user_type: false }}
          facetedFilters={[
            {
              columnId: "status",
              title: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ],
            },
            {
              columnId: "user_type",
              title: "User Type",
              options: [
                { label: "Internal", value: "Internal" },
                { label: "External", value: "External" },
              ],
            },
          ]}
        />
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editUser={editUser}
        onSuccess={fetchUsers}
      />

      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this user"}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (deleteUserId) {
            try {
              const res = await fetch(`/api/users/${deleteUserId}`, { method: "DELETE" });
              if (res.ok) {
                toast.success("User deleted");
                fetchUsers();
              } else {
                toast.error("Failed to delete user");
              }
            } catch {
              toast.error("Server error");
            }
            setDeleteUserId(null);
          }
        }}
      />
    </div>
  );
}
