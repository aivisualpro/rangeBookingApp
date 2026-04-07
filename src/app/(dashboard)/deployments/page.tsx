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
import { Rocket, CheckCircle2, XCircle, Loader2, Clock, GitCommit, GitBranch, RotateCcw, Timer } from "lucide-react";

const summaryCards = [
  { title: "Today's Deploys", value: "18", icon: Rocket, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Success Rate", value: "94.2%", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  { title: "Avg Duration", value: "3m 24s", icon: Timer, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "Rollbacks", value: "2", icon: RotateCcw, color: "text-warning", bg: "bg-warning/10" },
];

type DeployStatus = "success" | "failed" | "rolling" | "cancelled";

const statusConfig: Record<DeployStatus, { label: string; variant: "success" | "destructive" | "warning" | "secondary"; icon: React.ElementType }> = {
  success: { label: "Success", variant: "success", icon: CheckCircle2 },
  failed: { label: "Failed", variant: "destructive", icon: XCircle },
  rolling: { label: "Rolling", variant: "warning", icon: Loader2 },
  cancelled: { label: "Cancelled", variant: "secondary", icon: XCircle },
};

const envConfig = {
  production: "bg-primary/10 text-primary border-primary/20",
  staging: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  development: "bg-muted text-muted-foreground border-border",
};

const deployments = [
  { service: "api-gateway", version: "v2.14.0", commit: "a1b2c3d", branch: "main", env: "production" as const, status: "success" as DeployStatus, duration: "2m 18s", deployer: "Sarah Kim", initials: "SK", time: "2 min ago" },
  { service: "auth-service", version: "v1.8.3", commit: "e4f5g6h", branch: "hotfix/auth-fix", env: "production" as const, status: "rolling" as DeployStatus, duration: "1m 42s", deployer: "Alex Chen", initials: "AC", time: "5 min ago" },
  { service: "web-frontend", version: "v3.2.1", commit: "i7j8k9l", branch: "main", env: "production" as const, status: "success" as DeployStatus, duration: "4m 52s", deployer: "Jordan Lee", initials: "JL", time: "18 min ago" },
  { service: "payment-service", version: "v2.1.0", commit: "m0n1o2p", branch: "release/2.1", env: "staging" as const, status: "success" as DeployStatus, duration: "3m 05s", deployer: "Morgan Davis", initials: "MD", time: "32 min ago" },
  { service: "notification-svc", version: "v1.4.7", commit: "q3r4s5t", branch: "main", env: "production" as const, status: "failed" as DeployStatus, duration: "1m 12s", deployer: "Riley Park", initials: "RP", time: "45 min ago" },
  { service: "user-service", version: "v2.9.0", commit: "u6v7w8x", branch: "feature/profiles", env: "development" as const, status: "success" as DeployStatus, duration: "2m 38s", deployer: "Casey Wong", initials: "CW", time: "1h ago" },
  { service: "search-service", version: "v1.2.4", commit: "y9z0a1b", branch: "main", env: "staging" as const, status: "success" as DeployStatus, duration: "5m 14s", deployer: "Sarah Kim", initials: "SK", time: "1.5h ago" },
  { service: "api-gateway", version: "v2.13.9", commit: "c2d3e4f", branch: "main", env: "production" as const, status: "success" as DeployStatus, duration: "2m 22s", deployer: "Alex Chen", initials: "AC", time: "2h ago" },
  { service: "worker-queue", version: "v1.6.2", commit: "g5h6i7j", branch: "main", env: "production" as const, status: "cancelled" as DeployStatus, duration: "0m 48s", deployer: "Jordan Lee", initials: "JL", time: "3h ago" },
  { service: "metrics-collector", version: "v1.1.0", commit: "k8l9m0n", branch: "release/1.1", env: "staging" as const, status: "success" as DeployStatus, duration: "3m 44s", deployer: "Morgan Davis", initials: "MD", time: "4h ago" },
];

const avatarColors = [
  "from-chart-1/70 to-chart-1",
  "from-chart-2/70 to-chart-2",
  "from-chart-3/70 to-chart-3",
  "from-chart-4/70 to-chart-4",
  "from-chart-5/70 to-chart-5",
];

export default function DeploymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Deployments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track and manage service deployments across environments</p>
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
          <CardTitle className="text-base font-semibold">Deployment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Service</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Version</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Branch</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Environment</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Duration</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Deployed by</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d, i) => {
                  const cfg = statusConfig[d.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={`${d.service}-${d.commit}`} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium font-mono">{d.service}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold">{d.version}</span>
                          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-0.5">
                            <GitCommit className="h-3 w-3" />{d.commit}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <GitBranch className="h-3 w-3" />{d.branch}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium", envConfig[d.env])}>
                          {d.env}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant={cfg.variant} className="text-[10px] gap-1">
                          <StatusIcon className={cn("h-3 w-3", d.status === "rolling" && "animate-spin")} />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                          <Clock className="h-3 w-3" />{d.duration}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-[9px] font-bold text-white`}>
                              {d.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{d.deployer}</span>
                        </div>
                      </td>
                      <td className="py-3"><span className="text-xs text-muted-foreground">{d.time}</span></td>
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
