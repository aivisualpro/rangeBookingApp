"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { cn } from "@dashboardpack/core/lib/utils";
import { Activity, CheckCircle2, Clock } from "lucide-react";

function generateUptimeBar(): ("up" | "down" | "degraded")[] {
  return Array.from({ length: 30 }, () => {
    const r = Math.random();
    if (r > 0.97) return "down";
    if (r > 0.92) return "degraded";
    return "up";
  });
}

const services = [
  { name: "API Gateway", url: "api.example.com", status: "up" as const, uptime: 99.99, avgResponse: 42, lastChecked: "30s ago", lastIncident: "14 days ago", bar: [..."up".repeat(28).split("").map(() => "up" as const), "degraded" as const, "up" as const] },
  { name: "Web Application", url: "app.example.com", status: "up" as const, uptime: 99.97, avgResponse: 128, lastChecked: "30s ago", lastIncident: "3 days ago", bar: [..."up".repeat(26).split("").map(() => "up" as const), "down" as const, "up" as const, "up" as const, "up" as const] },
  { name: "Auth Service", url: "auth.example.com", status: "up" as const, uptime: 99.95, avgResponse: 67, lastChecked: "30s ago", lastIncident: "7 days ago", bar: [..."up".repeat(22).split("").map(() => "up" as const), "down" as const, "up" as const, "up" as const, "up" as const, "up" as const, "degraded" as const, "up" as const, "up" as const] },
  { name: "Payment API", url: "pay.example.com", status: "up" as const, uptime: 100.00, avgResponse: 89, lastChecked: "30s ago", lastIncident: "None", bar: Array.from({ length: 30 }, () => "up" as const) },
  { name: "Database Primary", url: "db.example.com:5432", status: "up" as const, uptime: 99.99, avgResponse: 4, lastChecked: "30s ago", lastIncident: "21 days ago", bar: [..."up".repeat(8).split("").map(() => "up" as const), "degraded" as const, ..."up".repeat(21).split("").map(() => "up" as const)] },
  { name: "Redis Cache", url: "redis.example.com:6379", status: "up" as const, uptime: 99.98, avgResponse: 2, lastChecked: "30s ago", lastIncident: "5 days ago", bar: [..."up".repeat(24).split("").map(() => "up" as const), "down" as const, ..."up".repeat(5).split("").map(() => "up" as const)] },
  { name: "Search Service", url: "search.example.com", status: "degraded" as const, uptime: 99.87, avgResponse: 342, lastChecked: "30s ago", lastIncident: "Today", bar: [..."up".repeat(25).split("").map(() => "up" as const), "degraded" as const, "up" as const, "down" as const, "degraded" as const, "degraded" as const] },
  { name: "CDN Edge", url: "cdn.example.com", status: "up" as const, uptime: 100.00, avgResponse: 18, lastChecked: "30s ago", lastIncident: "None", bar: Array.from({ length: 30 }, () => "up" as const) },
];

const barColorMap = {
  up: "bg-success",
  down: "bg-destructive",
  degraded: "bg-warning",
};

const statusDot = {
  up: "bg-success",
  down: "bg-destructive",
  degraded: "bg-warning",
};

export default function UptimePage() {
  const overall = (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Uptime Monitor</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track service availability and response times</p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
            <Activity className="h-7 w-7 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overall Uptime (30 days)</p>
            <p className="text-3xl font-bold text-success">{overall}%</p>
          </div>
          <div className="ml-auto hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> Operational</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Degraded</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive" /> Down</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.name} className="transition-all hover:shadow-md hover:border-primary/20">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn("h-3 w-3 rounded-full", statusDot[service.status])} />
                  <div>
                    <h3 className="text-sm font-semibold">{service.name}</h3>
                    <p className="text-[11px] font-mono text-muted-foreground">{service.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="font-semibold text-success">{service.uptime.toFixed(2)}%</p>
                    <p className="text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono font-semibold">{service.avgResponse}ms</p>
                    <p className="text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">{service.lastIncident}</p>
                    <p className="text-muted-foreground">Last Incident</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-[2px]">
                {service.bar.map((day, i) => (
                  <div key={i} className={cn("h-6 flex-1 rounded-[2px]", barColorMap[day])} title={`Day ${i + 1}`} />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/50">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
