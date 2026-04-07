"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Bell, Rocket, AlertTriangle, Users, Settings, CheckCheck } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "@dashboardpack/core/lib/data";
import type { NotificationType } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const filters = ["all", "unread", "read"] as const;
type Filter = (typeof filters)[number];

const typeIcon: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  order: { icon: Rocket, color: "text-chart-1", bg: "bg-chart-1/10" },
  payment: { icon: AlertTriangle, color: "text-chart-2", bg: "bg-chart-2/10" },
  customer: { icon: Users, color: "text-chart-3", bg: "bg-chart-3/10" },
  system: { icon: Settings, color: "text-chart-4", bg: "bg-chart-4/10" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const notifications = getNotifications(filter);
  const unreadCount = getUnreadCount();

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay up to date with your latest alerts and messages.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              markAllAsRead();
              refresh();
            }}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">All Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-[11px]">{unreadCount} unread</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">No notifications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filter === "unread" ? "All caught up!" : "No notifications to show."}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notif) => {
                const { icon: Icon, color, bg } = typeIcon[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "group flex cursor-pointer gap-3 rounded-lg px-3 py-4 transition-colors hover:bg-muted/30",
                      !notif.read && "bg-primary/[0.03]"
                    )}
                    onClick={() => {
                      if (!notif.read) {
                        markAsRead(notif.id);
                        refresh();
                      }
                    }}
                  >
                    <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bg)}>
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-medium leading-snug", !notif.read && "font-semibold")}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">{notif.description}</p>
                      <p className="text-[11px] text-muted-foreground/60">{notif.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
