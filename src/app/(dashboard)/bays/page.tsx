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
import { BayFormDialog } from "@/components/dashboard/bay-form-dialog";

export default function BaysPage() {
  const router = useRouter();
  const [bays, setBays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editBay, setEditBay] = useState<any>(null);

  const fetchBays = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bays");
      const json = await res.json();
      if (json.data) {
        setBays(json.data);
      }
    } catch (err) {
      toast.error("Failed to fetch bays");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBays();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/bays/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Bay deleted.");
        fetchBays();
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
      accessorKey: "bay_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bay Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/10 font-bold text-sidebar-primary shrink-0">
            {row.original.bay_name?.charAt(0) || "B"}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.bay_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.category}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "base_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Base Price" />,
      cell: ({ row }) => <span className="text-sm text-foreground/80">${row.original.base_price || '0'}</span>
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'Active' ? 'success' : 'secondary'}>
          {row.original.status || "Active"}
        </Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={(e) => { 
            e.stopPropagation(); 
            setEditBay({
              id: row.original.id,
              bay_name: row.original.bay_name,
              category: row.original.category,
              description: row.original.description,
              primary_image: row.original.primary_image,
              layout_image: row.original.layout_image,
              rules: row.original.rules,
              base_price: row.original.base_price,
              same_day_price: row.original.same_day_price,
              minimum_booking_fee: row.original.minimum_booking_fee,
              per_person_rate: row.original.per_person_rate,
              status: row.original.status,
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
          placeholder="Search bays..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-full sm:w-64 bg-background"
        />
      </HeaderSearchPortal>

      <HeaderActionsPortal>
        <Button onClick={() => { setEditBay(null); setFormOpen(true); }} size="sm" className="gap-1.5 h-9">
          <Plus className="h-4 w-4" />
          Add Bay
        </Button>
      </HeaderActionsPortal>

      <DataTable
        columns={columns}
        data={bays.filter(b => `${b.bay_name} ${b.category}`.toLowerCase().includes(globalFilter.toLowerCase()))}
        loading={isLoading}
        emptyMessage="No bays found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Bay"
        description="Are you sure you want to delete this Bay?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <BayFormDialog 
        open={formOpen}
        onOpenChange={setFormOpen}
        editBay={editBay}
        onSuccess={fetchBays}
      />
    </>
  );
}
