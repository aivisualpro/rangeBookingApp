"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { toast } from "sonner";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/customers");
      const json = await res.json();
      if (json.data) {
        setCustomers(json.data);
      }
    } catch (err) {
      toast.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/customers/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Customer and associated users deleted.");
        fetchCustomers();
      } else {
        toast.error("Failed to delete.");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "company_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary shrink-0">
            {row.original.company_name?.charAt(0) || "C"}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.company_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.primary_contact_email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "primary_contact_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
      cell: ({ row }) => <span className="text-sm text-foreground/80">{row.original.primary_contact_name || 'N/A'}</span>
    },
    {
      accessorKey: "insurance_status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Insurance" />,
      cell: ({ row }) => (
        <Badge variant={row.original.insurance_status === 'active' ? 'success' : 'secondary'} className="capitalize">
          {row.original.insurance_status || "pending"}
        </Badge>
      )
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'destructive'}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/customers/${row.original.id}/edit`); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(row.original.id); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="mb-6">
        <PageHeader title="Customers" description="Manage Range Companies and their settings." breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Customers" }]}>
          <Button onClick={() => router.push("/customers/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        </PageHeader>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search companies..."
        emptyMessage="No customers found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Customer"
        description="Are you sure you want to delete this company? This will also remove any users assigned to to it."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
