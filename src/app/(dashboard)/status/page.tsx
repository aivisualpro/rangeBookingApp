"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { cn } from "@dashboardpack/core/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Clock, Globe, Activity } from "lucide-react";

type ServiceStatus = "operational" | "degraded" | "partial-outage" | "major-outage";
type IncidentSeverity = "minor" | "major" | "critical";

const overallStatus: ServiceStatus = "degraded";

const statusConfig: Record<ServiceStatus, { label: string; color: string; icon: React.ElementType; bg: string; border: string }> = {
  operational: { label: "All Systems Operational", color: "text-success", icon: CheckCircle2, bg: "bg-success/10", border: "border-success/20" },
  degraded: { label: "Degraded Performance", color: "text-warning", icon: AlertTriangle, bg: "bg-warning/10", border: "border-warning/20" },
  "partial-outage": { label: "Partial System Outage", color: "text-destructive", icon: AlertTriangle, bg: "bg-destructive/10", border: "border-destructive/20" },
  "major-outage": { label: "Major System Outage", color: "text-destructive", icon: XCircle, bg: "bg-destructive/10", border: "border-destructive/20" },
};

const incidentSeverityConfig: Record<IncidentSeverity, { label: string; variant: "warning" | "destructive" | "secondary" }> = {
  minor: { label: "Minor", variant: "secondary" },
  major: { label: "Major", variant: "warning" },
  critical: { label: "Critical", variant: "destructive" },
};

type DayStatus = "operational" | "degraded" | "outage" | "no-data";

const dayColors: Record<DayStatus, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  outage: "bg-destructive",
  "no-data": "bg-muted",
};

function generateDays(pattern: DayStatus[]): DayStatus[] {
  const days: DayStatus[] = [];
  for (let i = 0; i < 90; i++) {
    days.push(pattern[i % pattern.length]);
  }
  return days;
}

const services = [
  { name: "API Gateway", status: "operational" as ServiceStatus, uptime: "99.99%", latency: "42ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Authentication Service", status: "operational" as ServiceStatus, uptime: "99.98%", latency: "28ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "degraded", "operational"]) },
  { name: "Compute Engine", status: "operational" as ServiceStatus, uptime: "99.97%", latency: "8ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Database Cluster", status: "operational" as ServiceStatus, uptime: "99.99%", latency: "3ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Log Ingestion Pipeline", status: "degraded" as ServiceStatus, uptime: "99.82%", latency: "320ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "degraded", "degraded", "degraded"]) },
  { name: "CDN / Static Assets", status: "operational" as ServiceStatus, uptime: "100%", latency: "12ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Webhook Delivery", status: "operational" as ServiceStatus, uptime: "99.94%", latency: "156ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "outage", "operational", "operational", "operational"]) },
  { name: "CI/CD Pipeline Runners", status: "operational" as ServiceStatus, uptime: "99.96%", latency: "—", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Email Notifications", status: "operational" as ServiceStatus, uptime: "99.91%", latency: "890ms", days: generateDays(["operational", "operational", "operational", "operational", "degraded", "operational", "operational", "operational", "operational", "operational"]) },
  { name: "Monitoring & Metrics", status: "operational" as ServiceStatus, uptime: "99.98%", latency: "18ms", days: generateDays(["operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational", "operational"]) },
];

const recentIncidents = [
  {
    date: "Feb 27, 2026",
    title: "Elevated latency on Log Ingestion Pipeline",
    severity: "minor" as IncidentSeverity,
    status: "investigating",
    duration: "Ongoing",
    services: ["Log Ingestion Pipeline"],
    updates: [
      { time: "14:32 UTC", text: "Investigating elevated p99 latency on the log ingestion service." },
      { time: "14:18 UTC", text: "Monitoring alert triggered: log ingestion p99 > 500ms." },
    ],
  },
  {
    date: "Feb 25, 2026",
    title: "Webhook delivery failures",
    severity: "major" as IncidentSeverity,
    status: "resolved",
    duration: "47 min",
    services: ["Webhook Delivery"],
    updates: [
      { time: "09:42 UTC", text: "Resolved. Root cause: connection pool exhaustion on webhook workers." },
      { time: "09:18 UTC", text: "Fix deployed. Monitoring recovery." },
      { time: "08:55 UTC", text: "Webhook delivery queue backing up. Investigating." },
    ],
  },
  {
    date: "Feb 20, 2026",
    title: "Authentication latency spike",
    severity: "minor" as IncidentSeverity,
    status: "resolved",
    duration: "12 min",
    services: ["Authentication Service"],
    updates: [
      { time: "16:34 UTC", text: "Resolved. Upstream DNS provider had transient resolution issues." },
      { time: "16:22 UTC", text: "Auth service showing elevated latency. Investigating." },
    ],
  },
  {
    date: "Feb 14, 2026",
    title: "Email notification delays",
    severity: "minor" as IncidentSeverity,
    status: "resolved",
    duration: "1h 23min",
    services: ["Email Notifications"],
    updates: [
      { time: "11:45 UTC", text: "Resolved. Email queue fully drained." },
      { time: "10:22 UTC", text: "Email send queue growing. Investigation ongoing." },
    ],
  },
];

export default function StatusPage() {
  const overall = statusConfig[overallStatus];
  const OverallIcon = overall.icon;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Status Page</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time system status and incident history</p>
      </div>

      {/* Overall Status Banner */}
      <Card className={cn("mb-6 border-2", overall.border)}>
        <CardContent className="flex items-center gap-4 p-6">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", overall.bg)}>
            <OverallIcon className={cn("h-6 w-6", overall.color)} />
          </div>
          <div>
            <p className={cn("text-lg font-bold", overall.color)}>{overall.label}</p>
            <p className="text-sm text-muted-foreground">Last checked 30 seconds ago · Updated every 30s</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentIncidents.map((incident, i) => {
              const sevCfg = incidentSeverityConfig[incident.severity];
              return (
                <div key={i} className="border-l-2 border-border pl-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{incident.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={sevCfg.variant} className="text-[10px]">{sevCfg.label}</Badge>
                        <Badge variant={incident.status === "resolved" ? "success" : "warning"} className="text-[10px]">
                          {incident.status === "resolved" ? "Resolved" : "Investigating"}
                        </Badge>
                        {incident.services.map((s) => (
                          <span key={s} className="text-[10px] text-muted-foreground font-mono">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-xs text-muted-foreground">{incident.date}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />{incident.duration}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {incident.updates.map((update, j) => (
                      <div key={j} className="flex gap-3 text-xs">
                        <span className="shrink-0 font-mono text-muted-foreground">{update.time}</span>
                        <span>{update.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
