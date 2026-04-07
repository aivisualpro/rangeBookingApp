"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { cn } from "@dashboardpack/core/lib/utils";
import { Database, Activity, Clock, HardDrive, Zap } from "lucide-react";

const summaryCards = [
  { title: "Active Connections", value: "142 / 200", icon: Activity, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Queries / sec", value: "1.2K", icon: Zap, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "Avg Query Time", value: "4.2ms", icon: Clock, color: "text-chart-3", bg: "bg-chart-3/10" },
  { title: "Storage Used", value: "68%", icon: HardDrive, color: "text-chart-4", bg: "bg-chart-4/10" },
];

type DbStatus = "healthy" | "warning" | "critical";

const statusConfig: Record<DbStatus, { label: string; variant: "success" | "warning" | "destructive"; dot: string }> = {
  healthy: { label: "Healthy", variant: "success", dot: "bg-success" },
  warning: { label: "Warning", variant: "warning", dot: "bg-warning" },
  critical: { label: "Critical", variant: "destructive", dot: "bg-destructive" },
};

const databases = [
  { name: "postgres-primary", type: "PostgreSQL", version: "16.2", status: "healthy" as DbStatus, connections: { used: 142, total: 200 }, storage: { used: 84, total: 256, unit: "GB" }, queriesPerSec: 845, avgLatency: "3.2ms", replicationLag: "—" },
  { name: "postgres-replica", type: "PostgreSQL", version: "16.2", status: "healthy" as DbStatus, connections: { used: 38, total: 100 }, storage: { used: 82, total: 256, unit: "GB" }, queriesPerSec: 312, avgLatency: "4.1ms", replicationLag: "0.3s" },
  { name: "redis-cache", type: "Redis", version: "7.2.4", status: "healthy" as DbStatus, connections: { used: 24, total: 50 }, storage: { used: 1.8, total: 4, unit: "GB" }, queriesPerSec: 12400, avgLatency: "0.2ms", replicationLag: "—" },
  { name: "redis-sessions", type: "Redis", version: "7.2.4", status: "healthy" as DbStatus, connections: { used: 18, total: 50 }, storage: { used: 0.6, total: 2, unit: "GB" }, queriesPerSec: 3200, avgLatency: "0.1ms", replicationLag: "—" },
  { name: "mongo-analytics", type: "MongoDB", version: "7.0.5", status: "warning" as DbStatus, connections: { used: 89, total: 100 }, storage: { used: 180, total: 500, unit: "GB" }, queriesPerSec: 156, avgLatency: "12.8ms", replicationLag: "1.2s" },
  { name: "mysql-legacy", type: "MySQL", version: "8.0.36", status: "healthy" as DbStatus, connections: { used: 12, total: 50 }, storage: { used: 24, total: 100, unit: "GB" }, queriesPerSec: 42, avgLatency: "6.4ms", replicationLag: "—" },
];

const typeColors: Record<string, string> = {
  PostgreSQL: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Redis: "bg-destructive/10 text-destructive border-destructive/20",
  MongoDB: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  MySQL: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export default function DatabasesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Database Monitor</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track database health, connections, and performance</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                  <Icon className={cn("h-5 w-5", card.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {databases.map((db) => {
          const stat = statusConfig[db.status];
          const connPct = Math.round((db.connections.used / db.connections.total) * 100);
          const storagePct = Math.round((db.storage.used / db.storage.total) * 100);
          return (
            <Card key={db.name} className="transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                      <Database className="h-4 w-4 text-chart-1" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold font-mono">{db.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("inline-flex rounded-md border px-1.5 py-0 text-[9px] font-medium", typeColors[db.type])}>
                          {db.type} {db.version}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={stat.variant} className="text-[10px]">{stat.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Connections</span>
                    <span className={cn("font-mono font-semibold", connPct > 85 ? "text-destructive" : connPct > 70 ? "text-warning" : "")}>
                      {db.connections.used}/{db.connections.total}
                    </span>
                  </div>
                  <Progress value={connPct} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-mono font-semibold">{db.storage.used}/{db.storage.total} {db.storage.unit}</span>
                  </div>
                  <Progress value={storagePct} className="h-1.5" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div>
                    <p className="text-xs font-mono font-semibold">{db.queriesPerSec.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">QPS</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold">{db.avgLatency}</p>
                    <p className="text-[10px] text-muted-foreground">Latency</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold">{db.replicationLag}</p>
                    <p className="text-[10px] text-muted-foreground">Rep. Lag</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
