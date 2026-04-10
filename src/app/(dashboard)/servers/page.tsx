"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { cn } from "@dashboardpack/core/lib/utils";
import { Server, Cpu, HardDrive, Globe, Clock } from "lucide-react";

const servers = [
  { name: "prod-web-01", status: "online" as const, region: "us-east-1", os: "Ubuntu 22.04", cpu: 45, memory: 68, disk: 32, uptime: "14d 6h", ip: "10.0.1.12" },
  { name: "prod-api-01", status: "online" as const, region: "us-west-2", os: "Amazon Linux 2023", cpu: 78, memory: 82, disk: 45, uptime: "7d 12h", ip: "10.0.2.20" },
  { name: "prod-api-02", status: "degraded" as const, region: "us-west-2", os: "Amazon Linux 2023", cpu: 92, memory: 88, disk: 47, uptime: "7d 12h", ip: "10.0.2.21" },
  { name: "prod-db-01", status: "online" as const, region: "us-east-1", os: "Ubuntu 22.04", cpu: 35, memory: 90, disk: 72, uptime: "30d 2h", ip: "10.0.1.50" },
  { name: "staging-web-01", status: "online" as const, region: "eu-west-1", os: "Ubuntu 22.04", cpu: 12, memory: 34, disk: 18, uptime: "3d 8h", ip: "10.1.1.10" },
  { name: "staging-api-01", status: "offline" as const, region: "eu-west-1", os: "Amazon Linux 2023", cpu: 0, memory: 0, disk: 22, uptime: "0d 0h", ip: "10.1.2.10" },
  { name: "prod-worker-01", status: "online" as const, region: "ap-southeast-1", os: "Ubuntu 22.04", cpu: 61, memory: 55, disk: 28, uptime: "21d 4h", ip: "10.2.1.30" },
];

const statusConfig = {
  online: { label: "Online", variant: "success" as const, dot: "bg-emerald-500" },
  degraded: { label: "Degraded", variant: "warning" as const, dot: "bg-amber-500" },
  offline: { label: "Offline", variant: "destructive" as const, dot: "bg-red-500" },
};

type StatusFilter = "all" | "online" | "degraded" | "offline";

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

export default function ServersPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const filtered = filter === "all" ? servers : servers.filter((s) => s.status === filter);
  const counts = { all: servers.length, online: servers.filter((s) => s.status === "online").length, degraded: servers.filter((s) => s.status === "degraded").length, offline: servers.filter((s) => s.status === "offline").length };

  return (
    <div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "online", "degraded", "offline"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((server) => {
          const cfg = statusConfig[server.status];
          return (
            <Card key={server.name} className="transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                      <Server className="h-4 w-4 text-chart-1" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{server.name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground font-mono">{server.ip}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{server.region}</span>
                  <span>{server.os}</span>
                </div>
                <GaugeBar label="CPU" value={server.cpu} icon={Cpu} />
                <GaugeBar label="Memory" value={server.memory} icon={HardDrive} />
                <GaugeBar label="Disk" value={server.disk} icon={HardDrive} />
                <div className="flex items-center gap-1 pt-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Uptime: {server.uptime}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
