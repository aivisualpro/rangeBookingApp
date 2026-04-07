"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { getUsers, deleteUser } from "@dashboardpack/core/lib/data";
import type { User, UserRole, UserStatus } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const statusFilters: { label: string; value: UserStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const roleVariant: Record<UserRole, "default" | "secondary" | "warning" | "outline"> = {
  admin: "default",
  editor: "secondary",
  moderator: "warning",
  viewer: "outline",
};

const statusVariant: Record<UserStatus, "success" | "secondary" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  suspended: "destructive",
};

export default function UsersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<UserStatus | "all">("all");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const { data: allUsers } = getUsers({
    status: filter === "all" ? undefined : filter,
    perPage: 100,
  });

  const deleteTarget = allUsers.find((u) => u.id === deleteUserId);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {row.original.initials}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={roleVariant[row.original.role]}
          className="capitalize text-[11px]"
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status]}
          className="capitalize text-[11px]"
        >
          {row.original.status}
        </Badge>
      ),
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
              router.push(`/users/${row.original.id}/edit`);
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

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Users"
          description="Manage team members, roles, and permissions."
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Users" },
          ]}
        >
          <Button onClick={() => router.push("/users/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </PageHeader>
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted p-0.5 w-fit">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              filter === f.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={allUsers}
        searchPlaceholder="Search users..."
        emptyMessage="No users found."
        onRowClick={(row) => router.push(`/users/${row.id}`)}
        exportFilename="users"
      />

      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this user"}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteUserId) {
            deleteUser(deleteUserId);
            setDeleteUserId(null);
            refresh();
          }
        }}
      />
    </>
  );
}
