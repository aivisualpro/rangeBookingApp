/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
import { CompanyFormDialog } from "@/components/dashboard/company-form-dialog";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<any>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/companies");
      const json = await res.json();
      if (json.data) {
        setCompanies(json.data);
      }
    } catch (err) {
      toast.error("Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/companies/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Company and associated users deleted.");
        fetchCompanies();
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
          </div>
        </div>
      )
    },
    {
      accessorKey: "primary_contact_email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.primary_contact_email?.toLowerCase() || '—'}</span>
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
          <Button variant="ghost" size="icon" onClick={(e) => { 
            e.stopPropagation(); 
            setEditCompany({
              id: row.original.id,
              company_name: row.original.company_name,
              primary_contact_name: row.original.primary_contact_name,
              primary_contact_email: row.original.primary_contact_email,
              primary_contact_phone: row.original.primary_contact_phone,
              is_active: row.original.is_active,
              insurance_status: row.original.insurance_status,
            });
            setFormOpen(true);
          }}>
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
      <HeaderSearchPortal>
        <Input
          placeholder="Search companies..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-full sm:w-64 bg-background"
        />
      </HeaderSearchPortal>

      <HeaderActionsPortal>
        <Button onClick={() => { setEditCompany(null); setFormOpen(true); }} size="sm" className="gap-1.5 h-9">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </HeaderActionsPortal>

      <DataTable
        columns={columns}
        data={companies.filter(c => `${c.company_name} ${c.primary_contact_name} ${c.primary_contact_email}`.toLowerCase().includes(globalFilter.toLowerCase()))}
        loading={isLoading}
        emptyMessage="No companies found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Company"
        description="Are you sure you want to delete this company? This will also remove any users assigned to to it."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <CompanyFormDialog 
        open={formOpen}
        onOpenChange={setFormOpen}
        editCompany={editCompany}
        onSuccess={fetchCompanies}
      />
    </>
  );
}
