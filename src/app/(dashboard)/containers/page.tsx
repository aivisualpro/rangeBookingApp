"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { cn } from "@dashboardpack/core/lib/utils";
import { Container, Play, Square, RotateCw, Cpu, HardDrive } from "lucide-react";

const summaryCards = [
  { title: "Total Containers", value: "24", icon: Container, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Running", value: "19", icon: Play, color: "text-success", bg: "bg-success/10" },
  { title: "Stopped", value: "4", icon: Square, color: "text-muted-foreground", bg: "bg-muted" },
  { title: "Avg CPU", value: "34%", icon: Cpu, color: "text-chart-2", bg: "bg-chart-2/10" },
];

const containers = [
  { name: "api-gateway", image: "nginx:1.25-alpine", status: "running" as const, cpu: 12, memory: "128MB / 256MB", ports: "8080:80", uptime: "14d 6h" },
  { name: "auth-service", image: "node:20-slim", status: "running" as const, cpu: 28, memory: "256MB / 512MB", ports: "3001:3001", uptime: "14d 6h" },
  { name: "user-service", image: "node:20-slim", status: "running" as const, cpu: 22, memory: "192MB / 512MB", ports: "3002:3002", uptime: "14d 6h" },
  { name: "payment-service", image: "node:20-slim", status: "running" as const, cpu: 35, memory: "320MB / 512MB", ports: "3003:3003", uptime: "7d 2h" },
  { name: "postgres-primary", image: "postgres:16-alpine", status: "running" as const, cpu: 45, memory: "1.2GB / 2GB", ports: "5432:5432", uptime: "30d 1h" },
  { name: "postgres-replica", image: "postgres:16-alpine", status: "running" as const, cpu: 18, memory: "800MB / 2GB", ports: "5433:5432", uptime: "30d 1h" },
  { name: "redis-cache", image: "redis:7-alpine", status: "running" as const, cpu: 8, memory: "64MB / 256MB", ports: "6379:6379", uptime: "30d 1h" },
  { name: "worker-queue", image: "node:20-slim", status: "running" as const, cpu: 42, memory: "384MB / 512MB", ports: "—", uptime: "3d 8h" },
  { name: "log-collector", image: "fluent/fluentd:v1.16", status: "stopped" as const, cpu: 0, memory: "0MB / 256MB", ports: "24224:24224", uptime: "—" },
  { name: "metrics-agent", image: "prom/node-exporter:latest", status: "restarting" as const, cpu: 5, memory: "32MB / 128MB", ports: "9100:9100", uptime: "0d 0h" },
];

const statusConfig = {
  running: { label: "Running", variant: "success" as const },
  stopped: { label: "Stopped", variant: "secondary" as const },
  restarting: { label: "Restarting", variant: "warning" as const },
};

export default function ContainersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Containers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of running containers and resource usage</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Container Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Container</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Image</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">CPU</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Memory</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Ports</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((c) => {
                  const cfg = statusConfig[c.status];
                  return (
                    <tr key={c.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Container className="h-4 w-4 text-chart-1" />
                          <span className="text-sm font-medium font-mono">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3"><span className="text-xs font-mono text-muted-foreground">{c.image}</span></td>
                      <td className="py-3"><Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge></td>
                      <td className="py-3"><span className={cn("text-sm font-mono", c.cpu > 80 ? "text-destructive" : c.cpu > 60 ? "text-warning" : "")}>{c.cpu}%</span></td>
                      <td className="py-3"><span className="text-xs font-mono text-muted-foreground">{c.memory}</span></td>
                      <td className="py-3"><span className="text-xs font-mono text-muted-foreground">{c.ports}</span></td>
                      <td className="py-3"><span className="text-xs text-muted-foreground">{c.uptime}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
