"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { ThemeCustomizer } from "./theme-customizer";
import { TopNav } from "./top-nav";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dashboardpack/core/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import {
  Sun,
  Moon,
  Bell,
  Menu,
  Palette,
  Terminal,
  Rocket,
  Building2,
  Users,
  Settings,
  LogOut,
  CheckCheck,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { useNotifications, type NotificationType } from "@/providers/notification-provider";
import { signOut, useSession } from "next-auth/react";

const notificationIcon: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  registration: { icon: Users, color: "text-chart-3", bg: "bg-chart-3/10" },
  company: { icon: Building2, color: "text-chart-1", bg: "bg-chart-1/10" },
  booking: { icon: CalendarCheck, color: "text-chart-2", bg: "bg-chart-2/10" },
  system: { icon: Settings, color: "text-chart-4", bg: "bg-chart-4/10" },
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setMobileOpen, layout } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { data: session } = useSession();
  const [notifOpen, setNotifOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const recentNotifications = notifications.slice(0, 5);

  // Session-derived user info
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userInitials = userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const getRouteTitle = () => {
    if (!pathname || pathname === "/" || pathname === "/dashboard") return "Dashboard";
    const segments = pathname.split("/").filter(Boolean);
    const mainSegment = segments[0];
    if (!mainSegment) return "Dashboard";
    
    let title = mainSegment.replace(/-/g, " ");
    
    if (segments.length > 1) {
      if (segments[segments.length - 1] === "new") {
        title = "New " + title.replace(/s$/, ""); 
      } else if (segments[segments.length - 1] === "edit") {
        title = "Edit " + title.replace(/s$/, "");
      }
    }
    
    return title.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="sticky top-0 z-30">
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Left: Mobile menu + Logo (topnav) + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {layout === "topnav" && (
          <div className="hidden items-center gap-2.5 lg:flex">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="mx-1 h-6 w-px bg-border" />
          </div>
        )}

        {/* Dynamic Route Title for all layouts */}
        <div className="flex items-center gap-2.5 ms-2">
           <span className="text-xl font-bold tracking-tight text-foreground">{getRouteTitle()}</span>
           <div id="route-header-search" className="ml-4 hidden sm:flex items-center shrink-0 w-64 w-full"></div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div id="route-header-actions" className="flex items-center shrink-0 mr-2"></div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          suppressHydrationWarning
        >
          <Sun className="h-4 w-4 hidden dark:block" suppressHydrationWarning />
          <Moon className="h-4 w-4 block dark:hidden" suppressHydrationWarning />
        </button>

        {/* Customizer */}
        <button
          onClick={() => setCustomizerOpen(true)}
          aria-label="Customize theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Palette className="h-4 w-4" />
        </button>

        {/* Notifications popover */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label="Notifications"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute ltr:right-1.5 rtl:left-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{t("header.notifications")}</p>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <CheckCheck className="h-3 w-3" />
                  {t("header.markAllRead")}
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {t("header.noNotifications")}
                </p>
              ) : (
                recentNotifications.map((notif) => {
                  const typeInfo = notificationIcon[notif.type] || notificationIcon.system;
                  const Icon = typeInfo.icon;
                  return (
                    <button
                      key={notif.id}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-accent/50",
                        !notif.read && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (!notif.read) markAsRead(notif.id);
                        setNotifOpen(false);
                        if (notif.link) router.push(notif.link);
                        else router.push("/notifications");
                      }}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          typeInfo.bg
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5", typeInfo.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm truncate",
                            !notif.read ? "font-semibold" : "font-medium text-muted-foreground"
                          )}
                        >
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {notif.description}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/60">
                          {timeAgo(notif.time)}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
            <div className="border-t border-border">
              <Link
                href="/notifications"
                onClick={() => setNotifOpen(false)}
                className="flex items-center justify-center py-2.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t("header.viewAll")}
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="User menu"
              className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <Settings className="me-2 h-4 w-4" />
                {t("header.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/notifications")}>
                <Bell className="me-2 h-4 w-4" />
                {t("header.notifications")}
                {unreadCount > 0 && (
                  <span className="ms-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-semibold text-primary">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut({ redirect: true, callbackUrl: "/login" });
              }}
            >
              <LogOut className="me-2 h-4 w-4" />
              {t("header.logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ThemeCustomizer open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </header>
    {layout === "topnav" && <TopNav />}
    </div>
  );
}
