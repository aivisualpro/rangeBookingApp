"use client";

import React, { useState, useMemo } from "react";
import { useAPI } from "@/lib/use-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { HeaderSearchPortal } from "@/components/dashboard/header-portal";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, AlertTriangle, ShieldX, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@dashboardpack/core/lib/utils";

export default function DashboardPage() {
  const { data: bookings = [], isLoading: bookingsLoading, mutate: mutateBookings } = useAPI<any[]>("/api/bookings");
  const { data: companies = [], isLoading: companiesLoading } = useAPI<any[]>("/api/companies");
  const [globalFilter, setGlobalFilter] = useState("");

  const now = new Date();
  const todayStr = useMemo(() => {
    // Format YYYY-MM-DD in local time
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // KPIs
  const todaysBookings = bookings.filter(b => b.booking_date === todayStr).length;
  const pendingApprovals = bookings.filter(b => b.status === "Pending" && b.booking_date >= todayStr).length;
  
  const expiringCois = companies.filter(c => {
    if (!c.coi_expiration_date) return false;
    const exp = new Date(c.coi_expiration_date);
    return exp > now && exp <= thirtyDaysFromNow;
  }).length;

  const expiredCois = companies.filter(c => {
    if (!c.coi_expiration_date) return false;
    const exp = new Date(c.coi_expiration_date);
    return exp < now;
  }).length;

  // Sorting recent bookings
  const recentBookings = [...bookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ref ID" />,
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.reference_id}</span>,
    },
    {
      accessorKey: "company_name_snapshot",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
      cell: ({ row }) => <span className="text-sm">{row.original.company_name_snapshot}</span>,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "bay_name_snapshot",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bay" />,
      cell: ({ row }) => <span className="text-sm">{row.original.bay_name_snapshot}</span>,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorFn: (row) => `${row.booking_date} ${row.start_time}`,
      id: "date_time",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date & Time" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.booking_date}</span>
          <span className="text-xs text-muted-foreground">{row.original.start_time} - {row.original.end_time}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const s = row.original.status;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (s === "Approved" || s === "Completed") variant = "success";
        if (s === "Pending") variant = "warning";
        if (s === "Denied" || s === "Cancelled") variant = "destructive";
        return <Badge variant={variant} className="text-[11px]">{s}</Badge>;
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
  ];

  const filteredBookings = recentBookings.filter(b => {
    const searchStr = `${b.reference_id} ${b.company_name_snapshot} ${b.bay_name_snapshot} ${b.booking_date}`.toLowerCase();
    return searchStr.includes(globalFilter.toLowerCase());
  });

  // Extract unique companies and bays for faceted filters
  const uniqueCompanies = Array.from(new Set(bookings.map(b => b.company_name_snapshot))).sort();
  const uniqueBays = Array.from(new Set(bookings.map(b => b.bay_name_snapshot))).sort();

  return (
    <>
      <HeaderSearchPortal>
        <Input
          placeholder="Search by ref, company, bay, date..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-full sm:w-80 bg-background"
        />
      </HeaderSearchPortal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Bookings</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{bookingsLoading ? "..." : todaysBookings}</div>
          </CardContent>
        </Card>

        <Card className={cn("hover:border-warning/50 transition-colors", pendingApprovals > 0 ? "border-warning/30 bg-warning/5" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{bookingsLoading ? "..." : pendingApprovals}</div>
            {pendingApprovals > 0 && <p className="text-[10px] text-warning font-semibold uppercase tracking-wider mt-1">Requires Attention</p>}
          </CardContent>
        </Card>

        <Card className={cn("hover:border-amber-500/50 transition-colors", expiringCois > 0 ? "border-amber-500/30 bg-amber-500/5" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">COIs Expiring Soon</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{companiesLoading ? "..." : expiringCois}</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Within 30 Days</p>
          </CardContent>
        </Card>

        <Card className={cn("hover:border-destructive/50 transition-colors", expiredCois > 0 ? "border-destructive/30 bg-destructive/5" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired COIs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive">{companiesLoading ? "..." : expiredCois}</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Needs Renewal</p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col flex-1 min-h-[500px] border-border/60 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border/50 bg-muted/20">
          <h2 className="text-lg font-bold tracking-tight">Recent Booking Activity</h2>
        </div>
        <div className="flex-1 min-h-0 flex flex-col p-4 bg-card">
          <DataTable
            columns={columns}
            data={filteredBookings}
            loading={bookingsLoading && bookings.length === 0}
            exportFilename="recent-bookings"
            facetedFilters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                  { label: "Denied", value: "Denied" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Completed", value: "Completed" },
                ],
              },
              {
                columnId: "company_name_snapshot",
                title: "Company",
                options: uniqueCompanies.map(c => ({ label: c, value: c })),
              },
              {
                columnId: "bay_name_snapshot",
                title: "Bay",
                options: uniqueBays.map(b => ({ label: b, value: b })),
              }
            ]}
          />
        </div>
      </Card>
    </>
  );
}
