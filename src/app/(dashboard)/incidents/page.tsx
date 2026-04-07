"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { cn } from "@dashboardpack/core/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, Search, Timer, Flame } from "lucide-react";

const summaryCards = [
  { title: "Open Incidents", value: "3", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { title: "MTTR", value: "18 min", icon: Timer, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "P1 This Week", value: "1", icon: Flame, color: "text-warning", bg: "bg-warning/10" },
  { title: "Resolved Today", value: "7", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
];

type Severity = "critical" | "high" | "medium" | "low";
type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

const severityConfig: Record<Severity, { label: string; variant: "destructive" | "warning" | "secondary"; color: string }> = {
  critical: { label: "P1 Critical", variant: "destructive", color: "border-l-destructive" },
  high: { label: "P2 High", variant: "warning", color: "border-l-warning" },
  medium: { label: "P3 Medium", variant: "secondary", color: "border-l-chart-2" },
  low: { label: "P4 Low", variant: "secondary", color: "border-l-muted-foreground" },
};

const statusConfig: Record<IncidentStatus, { label: string; dot: string }> = {
  investigating: { label: "Investigating", dot: "bg-destructive" },
  identified: { label: "Identified", dot: "bg-warning" },
  monitoring: { label: "Monitoring", dot: "bg-chart-2" },
  resolved: { label: "Resolved", dot: "bg-success" },
};

const incidents = [
  { id: "INC-2847", severity: "critical" as Severity, status: "identified" as IncidentStatus, title: "Database connection pool exhaustion", services: ["postgres-primary", "api-gateway", "auth-service"], assignee: "Sarah Kim", initials: "SK", duration: "Active for 23 min", started: "14:02 UTC" },
  { id: "INC-2846", severity: "high" as Severity, status: "investigating" as IncidentStatus, title: "API latency spike in us-east-1", services: ["api-gateway", "load-balancer"], assignee: "Alex Chen", initials: "AC", duration: "Active for 45 min", started: "13:40 UTC" },
  { id: "INC-2845", severity: "medium" as Severity, status: "monitoring" as IncidentStatus, title: "Elevated error rate on payment webhook", services: ["payment-service"], assignee: "Jordan Lee", initials: "JL", duration: "Active for 1h 12m", started: "13:13 UTC" },
  { id: "INC-2844", severity: "low" as Severity, status: "resolved" as IncidentStatus, title: "SSL certificate renewal warning", services: ["web-frontend"], assignee: "Morgan Davis", initials: "MD", duration: "Resolved in 8 min", started: "12:30 UTC" },
  { id: "INC-2843", severity: "high" as Severity, status: "resolved" as IncidentStatus, title: "Memory leak in worker-queue service", services: ["worker-queue"], assignee: "Riley Park", initials: "RP", duration: "Resolved in 32 min", started: "11:45 UTC" },
  { id: "INC-2842", severity: "critical" as Severity, status: "resolved" as IncidentStatus, title: "Complete API outage — DNS misconfiguration", services: ["api-gateway", "web-frontend", "auth-service"], assignee: "Sarah Kim", initials: "SK", duration: "Resolved in 18 min", started: "09:22 UTC" },
  { id: "INC-2841", severity: "medium" as Severity, status: "resolved" as IncidentStatus, title: "Slow queries on analytics dashboard", services: ["postgres-replica", "analytics-service"], assignee: "Casey Wong", initials: "CW", duration: "Resolved in 45 min", started: "08:15 UTC" },
  { id: "INC-2840", severity: "low" as Severity, status: "resolved" as IncidentStatus, title: "Log collector disk space warning", services: ["log-collector"], assignee: "Alex Chen", initials: "AC", duration: "Resolved in 12 min", started: "Yesterday 22:10 UTC" },
];

const avatarColors = [
  "from-chart-1/70 to-chart-1",
  "from-chart-2/70 to-chart-2",
  "from-chart-3/70 to-chart-3",
  "from-chart-4/70 to-chart-4",
  "from-chart-5/70 to-chart-5",
];

export default function IncidentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor and resolve active incidents</p>
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

      <div className="space-y-3">
        {incidents.map((incident, i) => {
          const sev = severityConfig[incident.severity];
          const stat = statusConfig[incident.status];
          return (
            <Card key={incident.id} className={cn("border-l-4 transition-all hover:shadow-md", sev.color)}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{incident.id}</span>
                      <Badge variant={sev.variant} className="text-[10px]">{sev.label}</Badge>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", stat.dot)} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold">{incident.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {incident.services.map((svc) => (
                        <span key={svc} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{svc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={`bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-[9px] font-bold text-white`}>
                          {incident.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{incident.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{incident.duration}</span>
                    </div>
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
