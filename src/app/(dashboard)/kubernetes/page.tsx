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
import { Box, Cpu, HardDrive, MemoryStick, Container, Layers } from "lucide-react";

const summaryCards = [
  { title: "Nodes", value: "8", suffix: " / 10", icon: Box, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Pods Running", value: "124", icon: Container, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "CPU Usage", value: "62%", icon: Cpu, color: "text-chart-3", bg: "bg-chart-3/10" },
  { title: "Namespaces", value: "12", icon: Layers, color: "text-chart-4", bg: "bg-chart-4/10" },
];

type NodeStatus = "ready" | "not-ready" | "cordoned";

const nodeStatusConfig: Record<NodeStatus, { label: string; variant: "success" | "destructive" | "warning"; dot: string }> = {
  ready: { label: "Ready", variant: "success", dot: "bg-success" },
  "not-ready": { label: "Not Ready", variant: "destructive", dot: "bg-destructive" },
  cordoned: { label: "Cordoned", variant: "warning", dot: "bg-warning" },
};

const nodes = [
  { name: "node-pool-1a-xk9m", role: "control-plane", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 2.4, total: 8, pct: 30 }, memory: { used: 6.2, total: 16, pct: 39 }, pods: { used: 28, total: 110 }, age: "142d" },
  { name: "node-pool-1a-j3nf", role: "worker", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 5.8, total: 8, pct: 73 }, memory: { used: 12.1, total: 16, pct: 76 }, pods: { used: 32, total: 110 }, age: "142d" },
  { name: "node-pool-1b-m8qw", role: "worker", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 6.2, total: 8, pct: 78 }, memory: { used: 13.4, total: 16, pct: 84 }, pods: { used: 28, total: 110 }, age: "98d" },
  { name: "node-pool-1b-r4vz", role: "worker", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 3.1, total: 8, pct: 39 }, memory: { used: 8.6, total: 16, pct: 54 }, pods: { used: 18, total: 110 }, age: "98d" },
  { name: "node-pool-1c-h7yt", role: "worker", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 4.5, total: 8, pct: 56 }, memory: { used: 10.2, total: 16, pct: 64 }, pods: { used: 24, total: 110 }, age: "67d" },
  { name: "node-pool-gpu-1a", role: "worker", status: "ready" as NodeStatus, version: "v1.29.2", cpu: { used: 7.1, total: 16, pct: 44 }, memory: { used: 48.2, total: 64, pct: 75 }, pods: { used: 8, total: 110 }, age: "34d" },
  { name: "node-pool-1c-p2kd", role: "worker", status: "cordoned" as NodeStatus, version: "v1.29.1", cpu: { used: 0.2, total: 8, pct: 3 }, memory: { used: 1.8, total: 16, pct: 11 }, pods: { used: 2, total: 110 }, age: "67d" },
  { name: "node-pool-1a-z5bw", role: "worker", status: "not-ready" as NodeStatus, version: "v1.29.2", cpu: { used: 0, total: 8, pct: 0 }, memory: { used: 0, total: 16, pct: 0 }, pods: { used: 0, total: 110 }, age: "142d" },
];

type PodPhase = "running" | "pending" | "succeeded" | "failed" | "crashloop";

const podPhaseConfig: Record<PodPhase, { label: string; variant: "success" | "warning" | "secondary" | "destructive" }> = {
  running: { label: "Running", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  succeeded: { label: "Succeeded", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
  crashloop: { label: "CrashLoop", variant: "destructive" },
};

const namespaces = [
  { name: "production", pods: { running: 42, pending: 0, failed: 0, crashloop: 0 }, cpu: "18.2 cores", memory: "48.6 Gi", services: 14 },
  { name: "staging", pods: { running: 28, pending: 2, failed: 0, crashloop: 0 }, cpu: "8.4 cores", memory: "22.1 Gi", services: 14 },
  { name: "monitoring", pods: { running: 12, pending: 0, failed: 0, crashloop: 0 }, cpu: "4.2 cores", memory: "16.8 Gi", services: 6 },
  { name: "kube-system", pods: { running: 18, pending: 0, failed: 0, crashloop: 0 }, cpu: "2.8 cores", memory: "8.4 Gi", services: 8 },
  { name: "ingress-nginx", pods: { running: 4, pending: 0, failed: 0, crashloop: 0 }, cpu: "1.2 cores", memory: "3.2 Gi", services: 2 },
  { name: "cert-manager", pods: { running: 3, pending: 0, failed: 0, crashloop: 0 }, cpu: "0.4 cores", memory: "0.8 Gi", services: 3 },
  { name: "dev", pods: { running: 15, pending: 1, failed: 1, crashloop: 1 }, cpu: "6.1 cores", memory: "14.2 Gi", services: 10 },
  { name: "data-pipeline", pods: { running: 8, pending: 0, failed: 0, crashloop: 0 }, cpu: "12.6 cores", memory: "32.4 Gi", services: 4 },
];

export default function KubernetesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Kubernetes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cluster overview — nodes, pods, namespaces, and resource usage</p>
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
          <CardTitle className="text-base font-semibold">Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">CPU</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Memory</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Pods</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Age</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => {
                  const stat = nodeStatusConfig[node.status];
                  return (
                    <tr key={node.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <span className="text-xs font-mono font-semibold">{node.name}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant={stat.variant} className="text-[10px]">{stat.label}</Badge>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "inline-flex rounded-md border px-1.5 py-0 text-[9px] font-medium",
                          node.role === "control-plane" ? "bg-chart-3/10 text-chart-3 border-chart-3/20" : "bg-muted text-muted-foreground border-border"
                        )}>
                          {node.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">CPU</span>
                            <span className={cn("font-mono font-semibold", node.cpu.pct > 80 ? "text-destructive" : node.cpu.pct > 60 ? "text-warning" : "")}>
                              {node.cpu.used}/{node.cpu.total}
                            </span>
                          </div>
                          <Progress value={node.cpu.pct} className="h-1" />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Mem</span>
                            <span className={cn("font-mono font-semibold", node.memory.pct > 80 ? "text-destructive" : node.memory.pct > 60 ? "text-warning" : "")}>
                              {node.memory.used}/{node.memory.total} Gi
                            </span>
                          </div>
                          <Progress value={node.memory.pct} className="h-1" />
                        </div>
                      </td>
                      <td className="py-3 text-end">
                        <span className="text-xs font-mono">{node.pods.used}</span>
                      </td>
                      <td className="py-3 text-end">
                        <span className="text-xs font-mono text-muted-foreground">{node.age}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Namespaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {namespaces.map((ns) => {
              const totalPods = ns.pods.running + ns.pods.pending + ns.pods.failed + ns.pods.crashloop;
              const healthyPct = totalPods > 0 ? Math.round((ns.pods.running / totalPods) * 100) : 0;
              return (
                <div key={ns.name} className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono font-semibold">{ns.name}</span>
                    <Badge variant={healthyPct === 100 ? "success" : healthyPct >= 80 ? "warning" : "destructive"} className="text-[10px]">
                      {healthyPct}% healthy
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs font-mono font-semibold text-success">{ns.pods.running}</p>
                      <p className="text-[10px] text-muted-foreground">Running</p>
                    </div>
                    <div>
                      <p className={cn("text-xs font-mono font-semibold", ns.pods.pending > 0 ? "text-warning" : "text-muted-foreground")}>{ns.pods.pending}</p>
                      <p className="text-[10px] text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <p className={cn("text-xs font-mono font-semibold", ns.pods.failed > 0 ? "text-destructive" : "text-muted-foreground")}>{ns.pods.failed}</p>
                      <p className="text-[10px] text-muted-foreground">Failed</p>
                    </div>
                    <div>
                      <p className={cn("text-xs font-mono font-semibold", ns.pods.crashloop > 0 ? "text-destructive" : "text-muted-foreground")}>{ns.pods.crashloop}</p>
                      <p className="text-[10px] text-muted-foreground">CrashLoop</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                    <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{ns.cpu}</span>
                    <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" />{ns.memory}</span>
                    <span>{ns.services} services</span>
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
