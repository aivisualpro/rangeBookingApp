"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { revenueData } from "@dashboardpack/core/lib/data";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, Eye, Users, MousePointer, Clock } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { DateRangePicker, type DateRange } from "@dashboardpack/core/components/shared/date-range-picker";

const periods = ["7d", "30d", "90d", "1y"] as const;
type Period = (typeof periods)[number] | null;

const periodToDays: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

const metricsData = [
  { title: "Page Views", value: "284,392", change: 24.7, icon: Eye, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Unique Visitors", value: "42,847", change: 12.3, icon: Users, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "Bounce Rate", value: "32.4%", change: -5.2, icon: MousePointer, color: "text-chart-3", bg: "bg-chart-3/10" },
  { title: "Avg. Session", value: "4m 32s", change: 8.1, icon: Clock, color: "text-chart-4", bg: "bg-chart-4/10" },
];

const categoryData = [
  { category: "Compute", revenue: 28500, orders: 342 },
  { category: "Storage", revenue: 12400, orders: 156 },
  { category: "Networking", revenue: 8900, orders: 89 },
  { category: "Databases", revenue: 6200, orders: 45 },
];

const topPages = [
  { page: "/api/v2/servers", views: 12847, unique: 8392, bounce: "28%" },
  { page: "/api/v2/deployments", views: 9234, unique: 6128, bounce: "31%" },
  { page: "/dashboard/metrics", views: 8456, unique: 5843, bounce: "24%" },
  { page: "/docs/getting-started", views: 7123, unique: 4891, bounce: "18%" },
  { page: "/api/v2/incidents", views: 5892, unique: 3746, bounce: "35%" },
];

const topCountries = [
  { country: "United States", visitors: 12847, pct: 30 },
  { country: "United Kingdom", visitors: 6423, pct: 15 },
  { country: "Germany", visitors: 5134, pct: 12 },
  { country: "Canada", visitors: 3847, pct: 9 },
  { country: "France", visitors: 2983, pct: 7 },
  { country: "Australia", visitors: 2561, pct: 6 },
];

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
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
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" && entry.value > 999
            ? `$${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("90d");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: daysAgo(90),
    to: new Date(),
  });

  const handlePeriodClick = useCallback((p: (typeof periods)[number]) => {
    setPeriod(p);
    const days = periodToDays[p];
    setDateRange({ from: daysAgo(days), to: new Date() });
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setPeriod(null);
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your business performance and key metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodClick(p)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          return (
            <Card key={metric.title}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
                    <div className="flex items-center gap-1.5">
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span className={cn("text-xs font-semibold", isPositive ? "text-success" : "text-destructive")}>
                        {isPositive ? "+" : ""}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", metric.bg)}>
                    <Icon className={cn("h-5 w-5", metric.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Page Views Line Chart */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Page Views Over Time</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly visitor traffic trends</p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dx={-8} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="orders" name="Visitors" stroke="var(--chart-1)" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "var(--background)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost by Category */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Cost by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution across infrastructure services</p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={80} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                <Bar dataKey="revenue" name="Cost" fill="var(--chart-2)" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Top Pages + Top Countries */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Top Pages</CardTitle>
            <p className="text-xs text-muted-foreground">Most visited pages this period</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Page</th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Views</th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Unique</th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page) => (
                    <tr key={page.page} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-sm font-mono text-sm">{page.page}</td>
                      <td className="py-3 text-end text-sm font-semibold">{page.views.toLocaleString()}</td>
                      <td className="py-3 text-end text-sm text-muted-foreground">{page.unique.toLocaleString()}</td>
                      <td className="py-3 text-end text-sm text-muted-foreground">{page.bounce}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Top Countries</CardTitle>
            <p className="text-xs text-muted-foreground">Where your visitors come from</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country) => (
                <div key={country.country} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium">{country.country}</span>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-chart-1 transition-all duration-500"
                        style={{ width: `${country.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-end text-sm text-muted-foreground">
                    {country.visitors.toLocaleString()}
                  </span>
                  <span className="w-8 text-end text-xs text-muted-foreground">{country.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
