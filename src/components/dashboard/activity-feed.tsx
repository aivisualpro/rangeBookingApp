"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import {
  Rocket,
  UserPlus,
  AlertTriangle,
  Star,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { activitiesData } from "@dashboardpack/core/lib/data";

const iconMap = {
  order: { icon: Rocket, color: "text-chart-1", bg: "bg-chart-1/10" },
  customer: { icon: UserPlus, color: "text-chart-2", bg: "bg-chart-2/10" },
  review: { icon: Star, color: "text-chart-5", bg: "bg-chart-5/10" },
  payment: { icon: AlertTriangle, color: "text-chart-3", bg: "bg-chart-3/10" },
  support: { icon: MessageSquare, color: "text-chart-4", bg: "bg-chart-4/10" },
};

export function ActivityFeed() {
  return (
    <Card className="col-span-full xl:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest events from your infrastructure
          </p>
        </div>
        <Link
          href="/notifications"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {activitiesData.map((activity) => {
            const { icon: Icon, color, bg } = iconMap[activity.iconType];
            return (
              <div
                key={activity.id}
                className="group flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/30"
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium leading-snug">{activity.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{activity.description}</p>
                  <p className="text-[11px] text-muted-foreground/60">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
