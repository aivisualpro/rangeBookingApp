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
import { Calendar, Clock, AlertTriangle, ShieldX, CheckCircle, XCircle, Server, Cpu, HardDrive, Globe, TrendingUp, Users, Activity, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@dashboardpack/core/lib/utils";
import { Treemap, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar } from "recharts";
import { skillsData, comboData, deviceUsageData } from "@dashboardpack/core/lib/data";

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

function ComboTooltip({
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
          {entry.name}:{" "}
          {entry.name === "Revenue"
            ? `$${(entry.value / 1000).toFixed(0)}k`
            : entry.name === "Growth %"
              ? `${entry.value}%`
              : entry.value}
        </p>
      ))}
    </div>
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

type BayTrendStatus = "optimal" | "moderate" | "low";
const statusConfig: Record<BayTrendStatus, { color: string; icon: React.ElementType }> = {
  optimal: { color: "text-success", icon: CheckCircle2 },
  moderate: { color: "text-warning", icon: Activity },
  low: { color: "text-destructive", icon: AlertTriangle },
};

type CapacityStatus = "full" | "partial" | "empty";
const dayColors: Record<CapacityStatus, string> = {
  full: "bg-success",
  partial: "bg-warning",
  empty: "bg-destructive",
};

function generateDays(pattern: CapacityStatus[]): CapacityStatus[] {
  const days: CapacityStatus[] = [];
  for (let i = 0; i < 30; i++) {
    days.push(pattern[i % pattern.length]);
  }
  return days;
}

const baysData = [
  { name: "Bay 1 - Rapid Fire", status: "optimal" as BayTrendStatus, currentCap: "92%", days: generateDays(["full", "full", "full", "full", "full", "full", "partial", "full"]) },
  { name: "Bay 2 - Precision", status: "optimal" as BayTrendStatus, currentCap: "100%", days: generateDays(["full", "full", "full", "full", "full", "full", "full"]) },
  { name: "Bay 3 - Tactical A", status: "optimal" as BayTrendStatus, currentCap: "88%", days: generateDays(["full", "partial", "full", "full", "full", "partial", "full"]) },
  { name: "Bay 4 - Tactical B", status: "moderate" as BayTrendStatus, currentCap: "64%", days: generateDays(["partial", "full", "partial", "partial", "full", "partial", "partial"]) },
  { name: "Bay 5 - Long Range", status: "optimal" as BayTrendStatus, currentCap: "100%", days: generateDays(["full", "full", "full", "full", "full", "full", "full"]) },
  { name: "Bay 6 - CQB House", status: "moderate" as BayTrendStatus, currentCap: "52%", days: generateDays(["partial", "empty", "partial", "partial", "partial", "empty", "partial"]) },
  { name: "Bay 7 - Virtual Simulator", status: "low" as BayTrendStatus, currentCap: "0%", days: generateDays(["empty", "empty", "empty", "empty", "empty", "empty", "empty"]) },
];

const categoryRevenueData = [
  { name: "Cowboy", value: 78, amount: 5850000, fill: "var(--chart-1)" },
  { name: "Other", value: 22, amount: 1650000, fill: "var(--chart-3)" },
];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
            <div className="h-8 w-8 rounded-full bg-chart-2/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">42,847</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-[10px] font-semibold text-success tracking-wider">+12.3% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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

        <Card className="flex-1 transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Top 5 company</CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">1. Globex Corp</span>
                <span className="font-mono font-semibold text-chart-1">$8,450,000</span>
              </div>
              <Progress value={100} className="h-1.5 [&>div]:bg-chart-1" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">2. Acme Innovations</span>
                <span className="font-mono font-semibold text-chart-1">$6,230,000</span>
              </div>
              <Progress value={74} className="h-1.5 [&>div]:bg-chart-1" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">3. Initech Solutions</span>
                <span className="font-mono font-semibold text-chart-1">$4,915,000</span>
              </div>
              <Progress value={58} className="h-1.5 [&>div]:bg-chart-1" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">4. Stark Industries</span>
                <span className="font-mono font-semibold text-chart-2">$3,120,000</span>
              </div>
              <Progress value={37} className="h-1.5 [&>div]:bg-chart-2" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">5. Virtucon Systems</span>
                <span className="font-mono font-semibold text-chart-2">$1,895,000</span>
              </div>
              <Progress value={22} className="h-1.5 [&>div]:bg-chart-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-4 flex flex-col gap-4 h-full">
          <Card className="flex-1 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Team Skills Assessment
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Current vs previous quarter competencies
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={320}>
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

          <Card className="flex-1 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Category Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="h-52 w-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="25%"
                      outerRadius="90%"
                      data={categoryRevenueData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        dataKey="value"
                        background={{ fill: "var(--muted)", opacity: 0.3 }}
                        cornerRadius={6}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const item = payload[0].payload as {
                            name: string;
                            value: number;
                          };
                          return (
                            <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
                              <p className="text-xs font-medium text-muted-foreground">
                                {item.name}
                              </p>
                              <p className="text-sm font-semibold">
                                {item.value}%
                              </p>
                            </div>
                          );
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-3">
                  {categoryRevenueData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold font-mono tracking-tight">
                        ${item.amount.toLocaleString()} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
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

      <div className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Yearly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={comboData}>
                <defs>
                  <linearGradient id="comboRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dy={8} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dx={-8} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dx={8} />
                <Tooltip content={<ComboTooltip />} />
                <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#comboRevGrad)" dot={false} />
                <Bar yAxisId="right" dataKey="orders" name="Booking Quantities" fill="var(--chart-3)" radius={[4, 4, 0, 0]} maxBarSize={28} opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth %" stroke="var(--chart-5)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Last 30 days Capacity Grid mounted at the very bottom */}
      <div className="mt-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Last 30 days booking Capacities by Bay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {baysData.map((bay) => {
                const stat = statusConfig[bay.status];
                const StatusIcon = stat.icon;
                return (
                  <div key={bay.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("h-4 w-4", stat.color)} />
                        <span className="text-sm font-medium">{bay.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-semibold">Capacity: {bay.currentCap}</span>
                      </div>
                    </div>
                    {/* 30-day capacity bar */}
                    <div className="flex gap-[2px]">
                      {bay.days.map((day, i) => (
                        <div
                          key={i}
                          className={cn("h-6 flex-1 rounded-[1px] transition-colors", dayColors[day])}
                          title={`Day ${30 - i}: ${day}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
