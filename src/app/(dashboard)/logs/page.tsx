"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Input } from "@dashboardpack/core/components/ui/input";
import { cn } from "@dashboardpack/core/lib/utils";
import { ScrollText, Search } from "lucide-react";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const levelConfig: Record<LogLevel, { variant: "secondary" | "default" | "warning" | "destructive"; color: string }> = {
  DEBUG: { variant: "secondary", color: "text-muted-foreground" },
  INFO: { variant: "default", color: "text-chart-2" },
  WARN: { variant: "warning", color: "text-warning" },
  ERROR: { variant: "destructive", color: "text-destructive" },
};

const logs = [
  { ts: "2026-02-27 14:25:12.340", level: "INFO" as LogLevel, service: "api-gateway", msg: "GET /api/v2/users 200 OK — 45ms" },
  { ts: "2026-02-27 14:25:11.892", level: "ERROR" as LogLevel, service: "auth-service", msg: "Connection pool exhausted, waiting for available connection" },
  { ts: "2026-02-27 14:25:11.445", level: "WARN" as LogLevel, service: "payment-service", msg: "Rate limit exceeded for IP 203.0.113.42 (429)" },
  { ts: "2026-02-27 14:25:10.998", level: "INFO" as LogLevel, service: "api-gateway", msg: "POST /api/v2/orders 201 Created — 128ms" },
  { ts: "2026-02-27 14:25:10.221", level: "DEBUG" as LogLevel, service: "worker-queue", msg: "Processing job batch #4821 — 12 items queued" },
  { ts: "2026-02-27 14:25:09.876", level: "INFO" as LogLevel, service: "web-frontend", msg: "TLS handshake completed with upstream proxy" },
  { ts: "2026-02-27 14:25:09.334", level: "ERROR" as LogLevel, service: "postgres-primary", msg: "FATAL: remaining connection slots reserved for superuser" },
  { ts: "2026-02-27 14:25:08.712", level: "INFO" as LogLevel, service: "redis-cache", msg: "Cache miss for key: session:usr_a8f2e4 — fetching from source" },
  { ts: "2026-02-27 14:25:08.198", level: "WARN" as LogLevel, service: "metrics-agent", msg: "Scrape target prod-worker-01:9100 unreachable — timeout after 5s" },
  { ts: "2026-02-27 14:25:07.645", level: "INFO" as LogLevel, service: "api-gateway", msg: "GET /api/v2/products?category=electronics 200 OK — 67ms" },
  { ts: "2026-02-27 14:25:07.102", level: "INFO" as LogLevel, service: "auth-service", msg: "JWT token refreshed for user usr_7d92f1 — expires in 3600s" },
  { ts: "2026-02-27 14:25:06.558", level: "DEBUG" as LogLevel, service: "log-collector", msg: "Flushing buffer — 2,847 events written to storage" },
  { ts: "2026-02-27 14:25:06.014", level: "ERROR" as LogLevel, service: "payment-service", msg: "Stripe webhook signature verification failed — event evt_1abc2def" },
  { ts: "2026-02-27 14:25:05.471", level: "INFO" as LogLevel, service: "api-gateway", msg: "DELETE /api/v2/sessions/sess_x9k2 204 No Content — 12ms" },
  { ts: "2026-02-27 14:25:04.927", level: "WARN" as LogLevel, service: "worker-queue", msg: "Job retry #3 for email:send — previous attempt failed with ECONNRESET" },
  { ts: "2026-02-27 14:25:04.383", level: "INFO" as LogLevel, service: "search-service", msg: "Elasticsearch index rebuilt — 142,847 documents indexed in 4.2s" },
  { ts: "2026-02-27 14:25:03.839", level: "INFO" as LogLevel, service: "api-gateway", msg: "PATCH /api/v2/users/usr_3f8a 200 OK — 34ms" },
  { ts: "2026-02-27 14:25:03.295", level: "DEBUG" as LogLevel, service: "postgres-replica", msg: "Replication lag: 0.3s — within acceptable threshold" },
  { ts: "2026-02-27 14:25:02.751", level: "ERROR" as LogLevel, service: "notification-svc", msg: "FCM push notification delivery failed — InvalidRegistration for device tok_9x2m" },
  { ts: "2026-02-27 14:25:02.207", level: "INFO" as LogLevel, service: "api-gateway", msg: "GET /health 200 OK — 1ms" },
];

type FilterLevel = "ALL" | LogLevel;

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<FilterLevel>("ALL");

  const filtered = logs.filter((log) => {
    if (level !== "ALL" && log.level !== level) return false;
    if (search && !log.msg.toLowerCase().includes(search.toLowerCase()) && !log.service.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-mono text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {(["ALL", "DEBUG", "INFO", "WARN", "ERROR"] as FilterLevel[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all",
                level === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filtered.map((log, i) => {
              const cfg = levelConfig[log.level];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-1 px-4 py-2.5 font-mono text-xs transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:gap-3",
                    i % 2 === 0 ? "bg-background" : "bg-muted/10"
                  )}
                >
                  <span className="shrink-0 text-muted-foreground/60">{log.ts}</span>
                  <Badge variant={cfg.variant} className="w-fit text-[9px] px-1.5 py-0">{log.level}</Badge>
                  <span className="shrink-0 text-muted-foreground">[{log.service}]</span>
                  <span className={cn("flex-1", cfg.color)}>{log.msg}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
