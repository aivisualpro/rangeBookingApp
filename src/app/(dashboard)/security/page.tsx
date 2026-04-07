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
import { Shield, AlertTriangle, Package, Clock, Bug } from "lucide-react";

const summaryCards = [
  { title: "Security Score", value: "87", suffix: "/ 100", icon: Shield, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Critical CVEs", value: "2", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { title: "Deps to Update", value: "8", icon: Package, color: "text-warning", bg: "bg-warning/10" },
  { title: "Last Scan", value: "2h ago", icon: Clock, color: "text-chart-2", bg: "bg-chart-2/10" },
];

type Severity = "critical" | "high" | "medium" | "low";
type FindingStatus = "open" | "patched" | "ignored";

const severityConfig: Record<Severity, { label: string; variant: "destructive" | "warning" | "secondary"; color: string; barColor: string }> = {
  critical: { label: "Critical", variant: "destructive", color: "text-destructive", barColor: "bg-destructive" },
  high: { label: "High", variant: "warning", color: "text-warning", barColor: "bg-warning" },
  medium: { label: "Medium", variant: "secondary", color: "text-chart-2", barColor: "bg-chart-2" },
  low: { label: "Low", variant: "secondary", color: "text-muted-foreground", barColor: "bg-muted-foreground" },
};

const statusConfig: Record<FindingStatus, { label: string; variant: "destructive" | "success" | "secondary" }> = {
  open: { label: "Open", variant: "destructive" },
  patched: { label: "Patched", variant: "success" },
  ignored: { label: "Ignored", variant: "secondary" },
};

const severitySummary = [
  { severity: "critical" as Severity, count: 2, total: 42 },
  { severity: "high" as Severity, count: 5, total: 42 },
  { severity: "medium" as Severity, count: 12, total: 42 },
  { severity: "low" as Severity, count: 23, total: 42 },
];

const findings = [
  { severity: "critical" as Severity, cve: "CVE-2026-1234", pkg: "openssl@3.1.4", desc: "Buffer overflow in TLS handshake processing", foundIn: "api-gateway", status: "open" as FindingStatus },
  { severity: "critical" as Severity, cve: "CVE-2026-0891", pkg: "libcurl@8.4.0", desc: "HTTP/2 stream cancellation memory leak", foundIn: "auth-service", status: "open" as FindingStatus },
  { severity: "high" as Severity, cve: "CVE-2026-0445", pkg: "node@20.10.0", desc: "Permission model bypass via path traversal", foundIn: "worker-queue", status: "patched" as FindingStatus },
  { severity: "high" as Severity, cve: "CVE-2025-9812", pkg: "express@4.18.2", desc: "ReDoS in URL parsing middleware", foundIn: "api-gateway", status: "open" as FindingStatus },
  { severity: "high" as Severity, cve: "CVE-2025-8734", pkg: "postgres@16.1", desc: "Privilege escalation via crafted SQL query", foundIn: "postgres-primary", status: "patched" as FindingStatus },
  { severity: "medium" as Severity, cve: "CVE-2025-7621", pkg: "lodash@4.17.21", desc: "Prototype pollution in merge function", foundIn: "web-frontend", status: "ignored" as FindingStatus },
  { severity: "medium" as Severity, cve: "CVE-2025-6543", pkg: "nginx@1.25.3", desc: "HTTP request smuggling via chunked encoding", foundIn: "api-gateway", status: "open" as FindingStatus },
  { severity: "low" as Severity, cve: "CVE-2025-5432", pkg: "zlib@1.3", desc: "Deflate compression ratio information disclosure", foundIn: "search-service", status: "ignored" as FindingStatus },
];

export default function SecurityPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Security Audit</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor vulnerabilities and compliance status</p>
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
                  <p className="text-xl font-bold">
                    {card.value}
                    {card.suffix && <span className="text-sm font-normal text-muted-foreground">{card.suffix}</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {severitySummary.map((item) => {
              const cfg = severityConfig[item.severity];
              const pct = Math.round((item.count / item.total) * 100);
              return (
                <div key={item.severity} className="flex items-center gap-3">
                  <span className={cn("w-16 text-xs font-medium", cfg.color)}>{cfg.label}</span>
                  <div className="flex-1">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full transition-all", cfg.barColor)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="w-8 text-right text-xs font-semibold">{item.count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Severity</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">CVE</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Package</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Description</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Found In</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => {
                  const sev = severityConfig[f.severity];
                  const stat = statusConfig[f.status];
                  return (
                    <tr key={f.cve} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3"><Badge variant={sev.variant} className="text-[10px]">{sev.label}</Badge></td>
                      <td className="py-3"><span className="text-xs font-mono font-semibold">{f.cve}</span></td>
                      <td className="py-3"><span className="text-xs font-mono text-muted-foreground">{f.pkg}</span></td>
                      <td className="py-3"><span className="text-xs">{f.desc}</span></td>
                      <td className="py-3"><span className="text-xs font-mono text-muted-foreground">{f.foundIn}</span></td>
                      <td className="py-3"><Badge variant={stat.variant} className="text-[10px]">{stat.label}</Badge></td>
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
