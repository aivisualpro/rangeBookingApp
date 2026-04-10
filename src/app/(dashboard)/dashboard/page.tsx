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
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { HeaderSearchPortal } from "@/components/dashboard/header-portal";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, AlertTriangle, ShieldX, CheckCircle, XCircle, Server, Cpu, HardDrive, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@dashboardpack/core/lib/utils";
import { Treemap, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { skillsData } from "@dashboardpack/core/lib/data";

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  unit?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

const revenueData = [
  { name: "Bay 1 (Marksman)", size: 420000, fill: "var(--chart-1)" },
  { name: "Bay 2 (Tactical)", size: 300000, fill: "var(--chart-2)" },
  { name: "Bay 3 (VIP)", size: 260000, fill: "var(--chart-3)" },
  { name: "Bay 4 (Archery)", size: 180000, fill: "var(--chart-4)" },
  { name: "Bay 5 (Pistol)", size: 150000, fill: "var(--chart-5)" },
  { name: "Bay 6 (Rifle)", size: 120000, fill: "var(--chart-1)" },
];

function TreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; size: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{item.name}</p>
      <p className="text-sm font-semibold">
        ${(item.size / 1000).toFixed(0)}k
      </p>
    </div>
  );
}

function CustomTreemapContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  fill?: string;
  depth?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, size, fill, depth } = props;

  if (depth !== 1) return null;

  const showLabel = width > 50 && height > 30;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="var(--background)"
        strokeWidth={2}
        rx={4}
        opacity={0.85}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-medium"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/70 text-[10px]"
          >
            ${((size ?? 0) / 1000).toFixed(0)}k
          </text>
        </>
      )}
    </g>
  );
}

function GaugeBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const color = value > 85 ? "text-destructive" : value > 70 ? "text-warning" : "text-muted-foreground";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className={cn("font-semibold", color)}>{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-4 flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={280}>
                <Treemap
                  data={revenueData}
                  dataKey="size"
                  nameKey="name"
                  content={<CustomTreemapContent />}
                >
                  <Tooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Team Skills Assessment
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Current vs previous quarter competencies
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                  <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 10,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Previous"
                    dataKey="previous"
                    stroke="var(--chart-3)"
                    fill="var(--chart-3)"
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{
                      color: "var(--muted-foreground)",
                      fontSize: 10,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="flex-1 transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                    <Server className="h-4 w-4 text-chart-1" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">prod-web-02</CardTitle>
                    <p className="text-[11px] text-muted-foreground font-mono">10.0.1.13</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Online</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" />us-east-1</span>
                <span>Ubuntu 22.04</span>
              </div>
              <GaugeBar label="CPU" value={52} icon={Cpu} />
              <GaugeBar label="Memory" value={71} icon={HardDrive} />
              <GaugeBar label="Disk" value={35} icon={HardDrive} />
              <div className="flex items-center gap-1 pt-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Uptime: 14d 6h
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:col-span-8 flex flex-col flex-1 min-h-[500px] border-border/60 rounded-2xl overflow-hidden">
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
      </div>
    </>
  );
}
