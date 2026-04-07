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
import { Globe, Zap, AlertTriangle, Clock, TrendingUp, TrendingDown } from "lucide-react";

const summaryCards = [
  { title: "Total Endpoints", value: "48", icon: Globe, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Avg Latency", value: "142ms", icon: Zap, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "Error Rate", value: "0.24%", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  { title: "Uptime (30d)", value: "99.98%", icon: Clock, color: "text-success", bg: "bg-success/10" },
];

type EndpointStatus = "healthy" | "degraded" | "down";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  POST: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  PUT: "bg-warning/10 text-warning border-warning/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
  PATCH: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

const statusConfig: Record<EndpointStatus, { label: string; variant: "success" | "warning" | "destructive"; dot: string }> = {
  healthy: { label: "Healthy", variant: "success", dot: "bg-success" },
  degraded: { label: "Degraded", variant: "warning", dot: "bg-warning" },
  down: { label: "Down", variant: "destructive", dot: "bg-destructive" },
};

const endpoints = [
  { method: "GET" as HttpMethod, path: "/api/v2/servers", service: "infra-api", status: "healthy" as EndpointStatus, rpm: 2450, p50: "12ms", p95: "45ms", p99: "128ms", errorRate: 0.02, trend: "up" as const },
  { method: "POST" as HttpMethod, path: "/api/v2/deployments", service: "deploy-api", status: "healthy" as EndpointStatus, rpm: 340, p50: "89ms", p95: "234ms", p99: "512ms", errorRate: 0.08, trend: "down" as const },
  { method: "GET" as HttpMethod, path: "/api/v2/metrics", service: "metrics-api", status: "healthy" as EndpointStatus, rpm: 8900, p50: "5ms", p95: "18ms", p99: "42ms", errorRate: 0.01, trend: "up" as const },
  { method: "POST" as HttpMethod, path: "/api/v2/incidents", service: "incident-api", status: "healthy" as EndpointStatus, rpm: 120, p50: "67ms", p95: "189ms", p99: "345ms", errorRate: 0.12, trend: "down" as const },
  { method: "GET" as HttpMethod, path: "/api/v2/logs/search", service: "log-api", status: "degraded" as EndpointStatus, rpm: 4200, p50: "34ms", p95: "320ms", p99: "1.2s", errorRate: 1.84, trend: "down" as const },
  { method: "PUT" as HttpMethod, path: "/api/v2/alerts/config", service: "alert-api", status: "healthy" as EndpointStatus, rpm: 85, p50: "23ms", p95: "67ms", p99: "145ms", errorRate: 0.04, trend: "up" as const },
  { method: "DELETE" as HttpMethod, path: "/api/v2/containers/:id", service: "container-api", status: "healthy" as EndpointStatus, rpm: 45, p50: "156ms", p95: "340ms", p99: "890ms", errorRate: 0.22, trend: "down" as const },
  { method: "GET" as HttpMethod, path: "/api/v2/pipelines", service: "ci-api", status: "healthy" as EndpointStatus, rpm: 1800, p50: "8ms", p95: "28ms", p99: "65ms", errorRate: 0.03, trend: "up" as const },
  { method: "POST" as HttpMethod, path: "/api/v2/webhooks", service: "webhook-api", status: "down" as EndpointStatus, rpm: 0, p50: "—", p95: "—", p99: "—", errorRate: 100, trend: "down" as const },
  { method: "PATCH" as HttpMethod, path: "/api/v2/users/:id/roles", service: "auth-api", status: "healthy" as EndpointStatus, rpm: 210, p50: "34ms", p95: "78ms", p99: "156ms", errorRate: 0.06, trend: "up" as const },
  { method: "GET" as HttpMethod, path: "/api/v2/databases/health", service: "db-api", status: "healthy" as EndpointStatus, rpm: 720, p50: "3ms", p95: "12ms", p99: "28ms", errorRate: 0.00, trend: "up" as const },
  { method: "POST" as HttpMethod, path: "/api/v2/notifications/send", service: "notif-api", status: "healthy" as EndpointStatus, rpm: 560, p50: "45ms", p95: "123ms", p99: "267ms", errorRate: 0.15, trend: "down" as const },
];

const latencyBuckets = [
  { label: "< 50ms", count: 28, pct: 58 },
  { label: "50–200ms", count: 12, pct: 25 },
  { label: "200–500ms", count: 5, pct: 10 },
  { label: "500ms–1s", count: 2, pct: 4 },
  { label: "> 1s", count: 1, pct: 2 },
];

export default function ApiMonitoringPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">API Monitoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track endpoint performance, latency percentiles, and error rates</p>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Latency Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {latencyBuckets.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-3">
                <span className="w-20 text-xs font-medium font-mono text-muted-foreground">{bucket.label}</span>
                <div className="flex-1">
                  <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        bucket.pct > 40 ? "bg-chart-1" : bucket.pct > 15 ? "bg-chart-2" : bucket.pct > 5 ? "bg-warning" : "bg-destructive"
                      )}
                      style={{ width: `${bucket.pct}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-xs font-semibold">{bucket.count} endpoints</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Endpoint</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Service</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">RPM</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">p50</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">p95</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">p99</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Error %</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep) => {
                  const stat = statusConfig[ep.status];
                  return (
                    <tr key={`${ep.method}-${ep.path}`} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("inline-flex rounded-md border px-1.5 py-0 text-[9px] font-bold", methodColors[ep.method])}>
                            {ep.method}
                          </span>
                          <span className="text-xs font-mono font-medium">{ep.path}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-xs font-mono text-muted-foreground">{ep.service}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant={stat.variant} className="text-[10px]">{stat.label}</Badge>
                      </td>
                      <td className="py-3 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs font-mono font-semibold">{ep.rpm.toLocaleString()}</span>
                          {ep.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-success" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-end"><span className="text-xs font-mono">{ep.p50}</span></td>
                      <td className="py-3 text-end"><span className="text-xs font-mono">{ep.p95}</span></td>
                      <td className="py-3 text-end">
                        <span className={cn("text-xs font-mono font-semibold", ep.p99 !== "—" && parseFloat(ep.p99) > 500 ? "text-warning" : "")}>
                          {ep.p99}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <span className={cn(
                          "text-xs font-mono font-semibold",
                          ep.errorRate > 1 ? "text-destructive" : ep.errorRate > 0.1 ? "text-warning" : ""
                        )}>
                          {ep.errorRate === 100 ? "DOWN" : `${ep.errorRate.toFixed(2)}%`}
                        </span>
                      </td>
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
