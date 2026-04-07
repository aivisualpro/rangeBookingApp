"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  GitBranch,
  Check,
  AlertTriangle,
  XCircle,
  Clock,
  Info,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data — Request Volume (24h)                                   */
/* ------------------------------------------------------------------ */

const requestVolumeData = [
  { hour: "00:00", success: 2120, errors: 18 },
  { hour: "01:00", success: 1840, errors: 14 },
  { hour: "02:00", success: 1520, errors: 11 },
  { hour: "03:00", success: 1280, errors: 10 },
  { hour: "04:00", success: 1180, errors: 12 },
  { hour: "05:00", success: 1420, errors: 15 },
  { hour: "06:00", success: 1890, errors: 22 },
  { hour: "07:00", success: 2450, errors: 28 },
  { hour: "08:00", success: 3100, errors: 35 },
  { hour: "09:00", success: 3540, errors: 42 },
  { hour: "10:00", success: 3780, errors: 48 },
  { hour: "11:00", success: 3920, errors: 52 },
  { hour: "12:00", success: 3650, errors: 45 },
  { hour: "13:00", success: 3840, errors: 50 },
  { hour: "14:00", success: 4020, errors: 58 },
  { hour: "15:00", success: 3900, errors: 55 },
  { hour: "16:00", success: 3720, errors: 48 },
  { hour: "17:00", success: 3480, errors: 42 },
  { hour: "18:00", success: 3050, errors: 38 },
  { hour: "19:00", success: 2780, errors: 32 },
  { hour: "20:00", success: 2540, errors: 28 },
  { hour: "21:00", success: 2320, errors: 22 },
  { hour: "22:00", success: 2080, errors: 18 },
  { hour: "23:00", success: 1920, errors: 15 },
];

/* ------------------------------------------------------------------ */
/*  Mock Data — Service Status Tiles                                   */
/* ------------------------------------------------------------------ */

type ServiceStatus = "healthy" | "degraded" | "down";

const serviceStatusData: { name: string; status: ServiceStatus }[] = [
  { name: "api-gateway", status: "healthy" },
  { name: "auth-service", status: "healthy" },
  { name: "user-service", status: "healthy" },
  { name: "payment-processor", status: "healthy" },
  { name: "notification-svc", status: "degraded" },
  { name: "search-indexer", status: "healthy" },
  { name: "log-aggregator", status: "healthy" },
  { name: "cache-layer", status: "healthy" },
  { name: "message-queue", status: "healthy" },
  { name: "cdn-proxy", status: "healthy" },
  { name: "rate-limiter", status: "healthy" },
  { name: "session-store", status: "degraded" },
  { name: "file-storage", status: "healthy" },
  { name: "email-relay", status: "healthy" },
  { name: "webhook-handler", status: "healthy" },
  { name: "analytics-ingest", status: "healthy" },
  { name: "metrics-collector", status: "healthy" },
  { name: "config-server", status: "healthy" },
  { name: "service-mesh", status: "healthy" },
  { name: "load-balancer", status: "healthy" },
  { name: "dns-resolver", status: "healthy" },
  { name: "cert-manager", status: "degraded" },
  { name: "secrets-vault", status: "healthy" },
  { name: "container-registry", status: "healthy" },
  { name: "ci-runner", status: "healthy" },
  { name: "artifact-store", status: "healthy" },
  { name: "db-primary", status: "down" },
  { name: "db-replica-1", status: "healthy" },
  { name: "db-replica-2", status: "healthy" },
  { name: "redis-cluster", status: "healthy" },
  { name: "kafka-broker", status: "healthy" },
  { name: "monitoring-agent", status: "healthy" },
];

const healthyCt = serviceStatusData.filter((s) => s.status === "healthy").length;
const degradedCt = serviceStatusData.filter((s) => s.status === "degraded").length;
const downCt = serviceStatusData.filter((s) => s.status === "down").length;

const statusColor: Record<ServiceStatus, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
};

/* ------------------------------------------------------------------ */
/*  Mock Data — Deployment Pipeline                                    */
/* ------------------------------------------------------------------ */

type DeployStatus = "success" | "rolling" | "failed";

const deployments: {
  id: number;
  service: string;
  version: string;
  commit: string;
  deployer: string;
  time: string;
  status: DeployStatus;
}[] = [
  {
    id: 1,
    service: "api-gateway",
    version: "v2.14.0",
    commit: "a3f8c21",
    deployer: "Alex Chen",
    time: "2 min ago",
    status: "success",
  },
  {
    id: 2,
    service: "auth-service",
    version: "v1.8.3",
    commit: "b7d4e09",
    deployer: "Jordan Park",
    time: "8 min ago",
    status: "rolling",
  },
  {
    id: 3,
    service: "payment-processor",
    version: "v3.2.1",
    commit: "c1e5f42",
    deployer: "Sam Rivera",
    time: "15 min ago",
    status: "success",
  },
  {
    id: 4,
    service: "notification-svc",
    version: "v1.4.0",
    commit: "d9a0b73",
    deployer: "Morgan Liu",
    time: "32 min ago",
    status: "failed",
  },
  {
    id: 5,
    service: "user-service",
    version: "v2.9.7",
    commit: "e4c6d18",
    deployer: "Taylor Kim",
    time: "1 hr ago",
    status: "success",
  },
];

const deployStatusVariant: Record<DeployStatus, "success" | "warning" | "destructive"> = {
  success: "success",
  rolling: "warning",
  failed: "destructive",
};

const deployStatusLabel: Record<DeployStatus, string> = {
  success: "Success",
  rolling: "Rolling",
  failed: "Failed",
};

/* ------------------------------------------------------------------ */
/*  Mock Data — KPI Gauges                                             */
/* ------------------------------------------------------------------ */

const kpiData = [
  {
    label: "Uptime",
    value: "99.8%",
    percent: 99.8,
    max: 100,
    color: "bg-success",
  },
  {
    label: "Avg Latency",
    value: "142ms",
    percent: (142 / 500) * 100,
    max: 500,
    color: "bg-warning",
  },
  {
    label: "Server Load",
    value: "84%",
    percent: 84,
    max: 100,
    color: "bg-warning",
  },
  {
    label: "Deploy Rate",
    value: "94%",
    percent: 94,
    max: 100,
    color: "bg-success",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock Data — Active Incidents                                       */
/* ------------------------------------------------------------------ */

type IncidentSeverity = "critical" | "warning" | "info";

const activeIncidents: {
  id: number;
  title: string;
  severity: IncidentSeverity;
  time: string;
}[] = [
  {
    id: 1,
    title: "DB Connection Pool Exhausted",
    severity: "critical",
    time: "12 min ago",
  },
  {
    id: 2,
    title: "SSL Certificate Expiring",
    severity: "warning",
    time: "28 min ago",
  },
  {
    id: 3,
    title: "High Memory Usage",
    severity: "warning",
    time: "1 hr ago",
  },
  {
    id: 4,
    title: "Scheduled Maintenance",
    severity: "info",
    time: "2 hr ago",
  },
  {
    id: 5,
    title: "API Rate Limit Approaching",
    severity: "info",
    time: "3 hr ago",
  },
];

const severityConfig: Record<
  IncidentSeverity,
  {
    dot: string;
    pulse: boolean;
    badge: "destructive" | "warning" | "secondary";
    label: string;
  }
> = {
  critical: {
    dot: "bg-destructive",
    pulse: true,
    badge: "destructive",
    label: "Critical",
  },
  warning: {
    dot: "bg-warning",
    pulse: false,
    badge: "warning",
    label: "Warning",
  },
  info: {
    dot: "bg-chart-1",
    pulse: false,
    badge: "secondary",
    label: "Info",
  },
};

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function RequestTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}/min
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Tile Tooltip                                               */
/* ------------------------------------------------------------------ */

function ServiceTile({
  service,
}: {
  service: { name: string; status: ServiceStatus };
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "h-6 w-6 rounded-sm cursor-default transition-transform hover:scale-110",
          statusColor[service.status]
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs shadow-lg">
          <span className="font-mono">{service.name}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Infrastructure Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time monitoring across all environments
        </p>
      </div>

      {/* ============================================================ */}
      {/*  ROW 1 — Request Volume + Service Status Tiles                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Request Volume (24h) */}
        <Card className="col-span-full xl:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Request Volume (24h)
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Success and error requests stacked per hour
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={requestVolumeData}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="errorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dy={8}
                  interval={2}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dx={-8}
                />
                <Tooltip content={<RequestTooltip />} />
                <Area
                  type="monotone"
                  dataKey="success"
                  name="Success"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#successGrad)"
                  stackId="requests"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  name="Errors"
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  fill="url(#errorsGrad)"
                  stackId="requests"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Status Tile Grid */}
        <Card className="col-span-full xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Service Status
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Live health across 32 microservices
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-1.5">
              {serviceStatusData.map((service) => (
                <ServiceTile key={service.name} service={service} />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
                <span>{healthyCt} Healthy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span>{degradedCt} Degraded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span>{downCt} Down</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================================ */}
      {/*  ROW 2 — Deployment Pipeline + KPI Gauges + Active Incidents  */}
      {/* ============================================================ */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Deployment Pipeline */}
        <Card className="col-span-full xl:col-span-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Deployment Pipeline
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Latest deployments across services
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5" />
                <span>5 recent</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-border ml-3">
              {deployments.map((deploy, idx) => {
                const StatusIcon =
                  deploy.status === "success"
                    ? Check
                    : deploy.status === "failed"
                      ? XCircle
                      : Clock;
                const dotColor =
                  deploy.status === "success"
                    ? "bg-success"
                    : deploy.status === "failed"
                      ? "bg-destructive"
                      : "bg-warning";

                return (
                  <div
                    key={deploy.id}
                    className={cn(
                      "relative pl-6 pb-6",
                      idx === deployments.length - 1 && "pb-0"
                    )}
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-background",
                        dotColor
                      )}
                    />
                    {/* Deployment card */}
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/40">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              deploy.status === "success" && "text-success",
                              deploy.status === "failed" && "text-destructive",
                              deploy.status === "rolling" && "text-warning"
                            )}
                          />
                          <span className="font-mono font-bold text-sm">
                            {deploy.service}
                          </span>
                        </div>
                        <Badge
                          variant={deployStatusVariant[deploy.status]}
                          className="text-[10px] shrink-0"
                        >
                          {deployStatusLabel[deploy.status]}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {deploy.version}
                        </Badge>
                        <span className="font-mono text-[11px] truncate max-w-[80px]">
                          {deploy.commit}
                        </span>
                        <span>{deploy.deployer}</span>
                        <span className="ml-auto">{deploy.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* KPI Progress Gauges */}
        <Card className="col-span-full xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Key Metrics
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Performance indicators
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {kpiData.map((kpi) => (
                <div key={kpi.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{kpi.label}</span>
                    <span className="text-sm font-mono font-bold">
                      {kpi.value}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn("h-2 rounded-full transition-all", kpi.color)}
                      style={{ width: `${Math.min(kpi.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card className="col-span-full xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Active Incidents
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Issues requiring attention
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activeIncidents.map((incident, idx) => {
                const config = severityConfig[incident.severity];
                return (
                  <div
                    key={incident.id}
                    className={cn(
                      "flex gap-3 py-3 transition-colors hover:bg-muted/30 rounded-lg px-2",
                      idx < activeIncidents.length - 1 &&
                        "border-b border-border/50"
                    )}
                  >
                    <div className="mt-1 shrink-0">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          config.dot,
                          config.pulse && "animate-pulse"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-mono font-medium leading-snug">
                        {incident.title}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={config.badge}
                          className="text-[10px]"
                        >
                          {config.label}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {incident.time}
                        </span>
                      </div>
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
