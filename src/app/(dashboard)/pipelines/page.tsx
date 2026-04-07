"use client";

import {
  Card,
  CardContent,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { cn } from "@dashboardpack/core/lib/utils";
import { GitBranch, GitCommit, CheckCircle2, XCircle, Loader2, Clock, Circle } from "lucide-react";

type StageStatus = "passed" | "failed" | "running" | "pending" | "skipped";
type TriggerType = "push" | "pull_request" | "schedule" | "manual";

interface PipelineStage {
  name: string;
  status: StageStatus;
}

interface Pipeline {
  id: string;
  name: string;
  commitMsg: string;
  branch: string;
  commit: string;
  trigger: TriggerType;
  triggeredBy: string;
  initials: string;
  stages: PipelineStage[];
  duration: string;
  time: string;
}

const stageConfig: Record<StageStatus, { color: string; icon: React.ElementType; bg: string }> = {
  passed: { color: "text-success", icon: CheckCircle2, bg: "bg-success" },
  failed: { color: "text-destructive", icon: XCircle, bg: "bg-destructive" },
  running: { color: "text-warning", icon: Loader2, bg: "bg-warning" },
  pending: { color: "text-muted-foreground", icon: Circle, bg: "bg-muted-foreground/30" },
  skipped: { color: "text-muted-foreground/50", icon: Circle, bg: "bg-muted-foreground/20" },
};

const triggerConfig: Record<TriggerType, { label: string; variant: "default" | "secondary" | "outline" }> = {
  push: { label: "push", variant: "default" },
  pull_request: { label: "PR", variant: "secondary" },
  schedule: { label: "cron", variant: "outline" },
  manual: { label: "manual", variant: "outline" },
};

const pipelines: Pipeline[] = [
  { id: "run-4821", name: "Build & Deploy", commitMsg: "feat: add real-time server metrics", branch: "main", commit: "a1b2c3d", trigger: "push", triggeredBy: "Sarah Kim", initials: "SK", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy", status: "passed" }, { name: "Verify", status: "passed" }], duration: "4m 32s", time: "12 min ago" },
  { id: "run-4820", name: "Build & Deploy", commitMsg: "fix: resolve auth timeout issue", branch: "hotfix/auth-fix", commit: "e4f5g6h", trigger: "push", triggeredBy: "Alex Chen", initials: "AC", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy", status: "running" }, { name: "Verify", status: "pending" }], duration: "3m 18s", time: "15 min ago" },
  { id: "run-4819", name: "Build & Deploy", commitMsg: "chore: update dependencies", branch: "main", commit: "i7j8k9l", trigger: "pull_request", triggeredBy: "Jordan Lee", initials: "JL", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "failed" }, { name: "Deploy", status: "skipped" }, { name: "Verify", status: "skipped" }], duration: "2m 04s", time: "28 min ago" },
  { id: "run-4818", name: "Build & Deploy", commitMsg: "feat: container health dashboard", branch: "feature/containers", commit: "m0n1o2p", trigger: "pull_request", triggeredBy: "Morgan Davis", initials: "MD", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy", status: "passed" }], duration: "5m 14s", time: "1h ago" },
  { id: "run-4817", name: "Nightly Regression", commitMsg: "Scheduled: full regression suite", branch: "main", commit: "q3r4s5t", trigger: "schedule", triggeredBy: "System", initials: "SY", stages: [{ name: "Build", status: "passed" }, { name: "Unit Tests", status: "passed" }, { name: "Integration", status: "passed" }, { name: "E2E", status: "passed" }], duration: "18m 42s", time: "6h ago" },
  { id: "run-4816", name: "Build & Deploy", commitMsg: "refactor: extract shared utils", branch: "main", commit: "u6v7w8x", trigger: "push", triggeredBy: "Riley Park", initials: "RP", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy", status: "passed" }], duration: "3m 56s", time: "8h ago" },
  { id: "run-4815", name: "Hotfix Deploy", commitMsg: "fix: payment webhook retry logic", branch: "hotfix/payment", commit: "y9z0a1b", trigger: "manual", triggeredBy: "Casey Wong", initials: "CW", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy Staging", status: "passed" }, { name: "Deploy Prod", status: "passed" }], duration: "6m 28s", time: "12h ago" },
  { id: "run-4814", name: "Build & Deploy", commitMsg: "docs: update API documentation", branch: "main", commit: "c2d3e4f", trigger: "push", triggeredBy: "Sarah Kim", initials: "SK", stages: [{ name: "Build", status: "passed" }, { name: "Test", status: "passed" }, { name: "Deploy", status: "passed" }], duration: "2m 48s", time: "Yesterday" },
];

const avatarColors = [
  "from-chart-1/70 to-chart-1",
  "from-chart-2/70 to-chart-2",
  "from-chart-3/70 to-chart-3",
  "from-chart-4/70 to-chart-4",
  "from-chart-5/70 to-chart-5",
];

export default function PipelinesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">CI/CD Pipelines</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor build and deployment workflows</p>
      </div>

      <div className="space-y-3">
        {pipelines.map((pipeline, i) => (
          <Card key={pipeline.id} className="transition-all hover:shadow-md hover:border-primary/20">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{pipeline.id}</span>
                    <Badge variant={triggerConfig[pipeline.trigger].variant} className="text-[10px]">
                      {triggerConfig[pipeline.trigger].label}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold">{pipeline.commitMsg}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />{pipeline.branch}</span>
                    <span className="flex items-center gap-1"><GitCommit className="h-3 w-3" />{pipeline.commit}</span>
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className={`bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-[8px] font-bold text-white`}>
                          {pipeline.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{pipeline.triggeredBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {pipeline.stages.map((stage, j) => {
                      const cfg = stageConfig[stage.status];
                      const Icon = cfg.icon;
                      return (
                        <div key={stage.name} className="flex items-center">
                          <div className="flex flex-col items-center gap-0.5" title={`${stage.name}: ${stage.status}`}>
                            <Icon className={cn("h-5 w-5", cfg.color, stage.status === "running" && "animate-spin")} />
                            <span className="text-[9px] text-muted-foreground">{stage.name}</span>
                          </div>
                          {j < pipeline.stages.length - 1 && (
                            <div className={cn("mx-1 h-[2px] w-4", j < pipeline.stages.length - 1 && pipeline.stages[j].status === "passed" ? "bg-success/50" : "bg-border")} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pipeline.duration}</span>
                    <span>{pipeline.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
