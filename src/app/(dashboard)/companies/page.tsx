/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Share2, Copy } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { toast } from "sonner";
import { HeaderSearchPortal, HeaderActionsPortal } from "@/components/dashboard/header-portal";
import { Input } from "@dashboardpack/core/components/ui/input";
import { CompanyFormDialog } from "@/components/dashboard/company-form-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@dashboardpack/core/components/ui/dialog";
import { useNotifications } from "@/providers/notification-provider";
import { useAPI } from "@/lib/use-api";

function StatusDropdownCell({ company, onUpdate }: { company: any, onUpdate: () => void }) {
  const [internalStatus, setInternalStatus] = useState(company.status || "inactive");

  useEffect(() => {
    setInternalStatus(company.status || "inactive");
  }, [company.status]);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === internalStatus) return;
    
    // Optimistic Background Update
    const previousStatus = internalStatus;
    setInternalStatus(newStatus);
    
    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
      toast.success(`Company marked as ${newStatus}`);
      // Silently refresh the table data without blocking
      onUpdate();
    } catch {
      setInternalStatus(previousStatus);
      toast.error("Failed to update status");
    }
  };

  const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
    active: 'success',
    inactive: 'warning',
    suspended: 'destructive',
  };

  return (
    <div className="relative inline-flex items-center group">
      <select 
        value={internalStatus}
        onChange={(e) => updateStatus(e.target.value)}
        className="appearance-none bg-transparent z-10 w-full h-full absolute inset-0 cursor-pointer opacity-0"
        title="Change Status"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
      <Badge
        variant={statusVariant[internalStatus] || 'warning'}
        className="capitalize text-[11px] transition-all group-hover:ring-2 ring-primary/20 ring-offset-1"
      >
        {internalStatus}
      </Badge>
    </div>
  );
}

export default function CompaniesPage() {
  const router = useRouter();
  const { data: companies = [], isLoading, mutate } = useAPI<any[]>("/api/companies");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<any>(null);
  const [shareCompany, setShareCompany] = useState<any>(null);
  const { lastEvent } = useNotifications();
  const prevEventRef = useRef(lastEvent);

  // Live-refresh when a new company/user registration event arrives via SSE
  useEffect(() => {
    if (lastEvent && lastEvent !== prevEventRef.current && lastEvent.channel === "companies") {
      prevEventRef.current = lastEvent;
      mutate();
      const eventData = lastEvent.data;
      if (eventData?.event === "new_company") {
        toast.info(`New company registered: ${eventData.data?.company_name || "Unknown"}`, {
          description: "Table refreshed automatically.",
        });
      } else if (eventData?.event === "company_updated") {
        toast.info(`Company updated: ${eventData.data?.company_name || "Unknown"}`, {
          description: "A new user joined this company.",
        });
      }
    }
  }, [lastEvent]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    // Background optimistic deletion
    const backup = [...companies];
    toast.success("Deleting company in background...");
    
    try {
      const res = await fetch(`/api/companies/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        mutate();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to delete company.");
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
      accessorKey: "users_count",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Users (Active / Total)" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] tracking-widest bg-muted/30">
          {row.original.users_count || "0 / 0"}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusDropdownCell company={row.original} onUpdate={() => mutate()} />
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={(e) => { 
            e.stopPropagation(); 
            setShareCompany(row.original);
          }} title="Share Join Link">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { 
            e.stopPropagation(); 
            setEditCompany({
              id: row.original.id,
              company_name: row.original.company_name,
              primary_contact_name: row.original.primary_contact_name,
              primary_contact_email: row.original.primary_contact_email,
              primary_contact_phone: row.original.primary_contact_phone,
              status: row.original.status,
              insurance_status: row.original.insurance_status,
              allowed_bays: row.original.allowed_bays || [],
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
        onSuccess={() => mutate()}
      />

      <Dialog open={!!shareCompany} onOpenChange={(v) => !v && setShareCompany(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Company Registration</DialogTitle>
            <DialogDescription>
              Provide this generated URL or QR code to new external members so they can join <strong className="text-primary">{shareCompany?.company_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="bg-white p-3 rounded-xl border shadow-sm">
              <img 
                src={shareCompany?.signup_url ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareCompany.signup_url)}` : undefined} 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="w-full space-y-2">
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Direct Invite Link</p>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={shareCompany?.signup_url || "Link not generated"} 
                  className="bg-muted text-xs font-mono h-10" 
                />
                <Button 
                  size="icon" 
                  className="shrink-0 h-10 w-10 btn-hover-effect"
                  disabled={!shareCompany?.signup_url}
                  onClick={() => {
                    if (shareCompany?.signup_url) {
                       navigator.clipboard.writeText(shareCompany.signup_url);
                       toast.success("Copied to clipboard!");
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
