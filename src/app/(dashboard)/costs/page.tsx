"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { cn } from "@dashboardpack/core/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, CloudCog } from "lucide-react";

const summaryCards = [
  { title: "Monthly Spend", value: "$24,892", change: "+8.2%", trending: "up" as const, icon: DollarSign, color: "text-chart-1", bg: "bg-chart-1/10" },
  { title: "Projected (EOM)", value: "$27,140", change: "+12.1%", trending: "up" as const, icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
  { title: "Budget Remaining", value: "$5,108", change: "17%", trending: "down" as const, icon: CreditCard, color: "text-chart-2", bg: "bg-chart-2/10" },
  { title: "Cost / Request", value: "$0.0034", change: "-5.3%", trending: "down" as const, icon: CloudCog, color: "text-success", bg: "bg-success/10" },
];

const serviceBreakdown = [
  { service: "Compute (EC2/GCE)", cost: 8942, pct: 36, budget: 9500, change: 4.2 },
  { service: "Kubernetes (EKS/GKE)", cost: 4812, pct: 19, budget: 5000, change: 12.8 },
  { service: "Database (RDS/CloudSQL)", cost: 3654, pct: 15, budget: 3500, change: -2.1 },
  { service: "Storage (S3/GCS)", cost: 2187, pct: 9, budget: 2500, change: 6.4 },
  { service: "Networking (LB/CDN)", cost: 1893, pct: 8, budget: 2000, change: -1.8 },
  { service: "Monitoring & Logs", cost: 1456, pct: 6, budget: 1500, change: 18.9 },
  { service: "CI/CD Pipelines", cost: 987, pct: 4, budget: 1000, change: 3.2 },
  { service: "Other", cost: 961, pct: 4, budget: 1500, change: -8.4 },
];

const teamSpend = [
  { team: "Platform Engineering", owner: "Sarah Kim", monthly: 9840, pctOfTotal: 40, trend: "up" as const, topResource: "EKS Clusters" },
  { team: "Backend Services", owner: "Alex Chen", monthly: 6230, pctOfTotal: 25, trend: "up" as const, topResource: "RDS Instances" },
  { team: "Data Pipeline", owner: "Jordan Lee", monthly: 4180, pctOfTotal: 17, trend: "down" as const, topResource: "EMR Clusters" },
  { team: "Frontend / CDN", owner: "Morgan Davis", monthly: 2450, pctOfTotal: 10, trend: "down" as const, topResource: "CloudFront" },
  { team: "Security & Compliance", owner: "Riley Park", monthly: 1240, pctOfTotal: 5, trend: "up" as const, topResource: "GuardDuty" },
  { team: "DevOps / SRE", owner: "Casey Wong", monthly: 952, pctOfTotal: 4, trend: "down" as const, topResource: "CI Runners" },
];

const optimizations = [
  { title: "Right-size 12 over-provisioned EC2 instances", savings: "$1,240/mo", effort: "low" as const, impact: "high" as const },
  { title: "Switch dev RDS to Aurora Serverless v2", savings: "$680/mo", effort: "medium" as const, impact: "medium" as const },
  { title: "Enable S3 Intelligent-Tiering on analytics bucket", savings: "$420/mo", effort: "low" as const, impact: "medium" as const },
  { title: "Consolidate 3 underutilized EKS node groups", savings: "$890/mo", effort: "high" as const, impact: "high" as const },
  { title: "Migrate staging to spot instances", savings: "$560/mo", effort: "medium" as const, impact: "medium" as const },
  { title: "Reduce log retention from 90d to 30d in dev", savings: "$340/mo", effort: "low" as const, impact: "low" as const },
];

const effortConfig = {
  low: { label: "Low", variant: "success" as const },
  medium: { label: "Medium", variant: "warning" as const },
  high: { label: "High", variant: "destructive" as const },
};

export default function CostsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Cloud Costs</h1>
        <p className="mt-1 text-sm text-muted-foreground">FinOps dashboard — track spend, budgets, and optimization opportunities</p>
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
                  <div className="flex items-center gap-1 mt-0.5">
                    {card.trending === "up" ? (
                      <TrendingUp className="h-3 w-3 text-destructive" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-success" />
                    )}
                    <span className={cn("text-[10px] font-medium", card.trending === "up" ? "text-destructive" : "text-success")}>
                      {card.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 mb-6">
        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Spend by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceBreakdown.map((svc) => {
                const overBudget = svc.cost > svc.budget;
                const usagePct = Math.round((svc.cost / svc.budget) * 100);
                return (
                  <div key={svc.service} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{svc.service}</span>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-xs font-mono font-semibold", overBudget ? "text-destructive" : "")}>
                          ${svc.cost.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ ${svc.budget.toLocaleString()}</span>
                        <span className={cn(
                          "flex items-center gap-0.5 text-[10px] font-medium",
                          svc.change > 0 ? "text-destructive" : "text-success"
                        )}>
                          {svc.change > 0 ? "+" : ""}{svc.change}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", overBudget ? "bg-destructive" : usagePct > 80 ? "bg-warning" : "bg-chart-1")}
                        style={{ width: `${Math.min(usagePct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Spend by Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamSpend.map((team) => (
                <div key={team.team} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/20">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold truncate">{team.team}</span>
                      {team.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-destructive shrink-0" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-success shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{team.owner} · {team.topResource}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-xs font-mono font-semibold">${team.monthly.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{team.pctOfTotal}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimizations.map((opt, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{opt.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={effortConfig[opt.effort].variant} className="text-[10px]">
                      {effortConfig[opt.effort].label} effort
                    </Badge>
                    <Badge variant={effortConfig[opt.impact].variant} className="text-[10px]">
                      {effortConfig[opt.impact].label} impact
                    </Badge>
                  </div>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-sm font-mono font-bold text-success">{opt.savings}</p>
                  <p className="text-[10px] text-muted-foreground">estimated</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
