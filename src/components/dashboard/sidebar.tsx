"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@dashboardpack/core/lib/utils";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import type { TranslationKey } from "@dashboardpack/core/lib/i18n/locale-context";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Server,
  Container,
  Rocket,
  AlertTriangle,
  ScrollText,
  Activity,
  GitBranch,
  Database,
  Shield,
  Settings,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Terminal,
  X,
  Kanban,
  Calendar,
  ListChecks,
  BookOpen,
  ChartNoAxesCombined,
  UserCog,
  Users,
  Layers,
  Globe,
  Radar,
  DollarSign,
  Crosshair,
} from "lucide-react";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  tKey?: TranslationKey;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  tKey?: TranslationKey;
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    tKey: "sidebar.overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", tKey: "sidebar.dashboard" },
      { icon: BarChart3, label: "Analytics", href: "/analytics", tKey: "sidebar.analytics" },
      { icon: ChartNoAxesCombined, label: "Charts", href: "/charts", tKey: "sidebar.charts" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { icon: Server, label: "Servers", href: "/servers" },
      { icon: Globe, label: "Status Page", href: "/status" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: ScrollText, label: "Logs", href: "/logs" },
    ],
  },
];

export const systemNav: NavGroup = {
  label: "Administration",
  tKey: "sidebar.system",
  items: [
    { icon: UserCog, label: "Users", href: "/users", tKey: "sidebar.users" },
    { icon: Users, label: "Companies", href: "/companies" },
    { icon: Crosshair, label: "Bays", href: "/bays" },
    { icon: Calendar, label: "Bookings", href: "/bookings" },
    { icon: Bell, label: "Alerts", href: "/notifications", badge: "5", tKey: "sidebar.notifications" },
    { icon: Settings, label: "Settings", href: "/settings", tKey: "sidebar.settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/support", tKey: "sidebar.helpSupport" },
  ],
};

function NavItemComponent({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  const t = useTranslations();
  const label = item.tKey ? t(item.tKey) : item.label;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[10px] font-semibold text-sidebar-primary">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && (
        <span className="absolute ltr:right-2 rtl:left-2 top-1 h-2 w-2 rounded-full bg-sidebar-primary" />
      )}
    </Link>
  );
}

function CollapsibleGroup({
  group,
  collapsed: sidebarCollapsed,
  isActive,
  defaultOpen,
}: {
  group: NavGroup;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const t = useTranslations();

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const groupLabel = group.tKey ? t(group.tKey) : group.label;

  // When sidebar is collapsed, show only icons (no group headers)
  if (sidebarCollapsed) {
    return (
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            collapsed={sidebarCollapsed}
            active={isActive(item.href)}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 transition-colors hover:text-sidebar-foreground/50"
      >
        <span className="flex-1 text-start">{groupLabel}</span>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 space-y-0.5">
            {group.items.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
                active={isActive(item.href)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));


  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Terminal className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Range Booking App
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pb-2 pt-4 border-b border-sidebar-border mb-2">
        {!collapsed ? (
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex h-9 w-full items-center rounded-lg border border-input bg-sidebar-accent/50 ps-3 pe-2 text-start text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent"
          >
            <Search className="h-4 w-4 mr-2 opacity-50" />
            <span className="flex-1 opacity-70">Search...</span>
            <kbd className="pointer-events-none rounded border border-border bg-sidebar px-1.5 text-[10px] font-medium opacity-50">⌘K</kbd>
          </button>
        ) : (
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sidebar-accent mx-auto text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
      >
        {navGroups.map((group) => (
          <CollapsibleGroup
            key={group.label}
            group={group}
            collapsed={collapsed}
            isActive={isActive}
            defaultOpen={true}
          />
        ))}

        <div className="my-2 border-t border-sidebar-border" />

        <div className="mb-2">
          <div className="space-y-0.5">
            {systemNav.items.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href)}
              />
            ))}
          </div>
        </div>


      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50",
              pathname === "/profile" && "bg-sidebar-accent/50"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-primary/80 to-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              AS
            </div>
            {!collapsed && (
              <div className="flex flex-1 flex-col truncate">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {session?.user?.name || "Admin User"}
                </span>
                <span className="text-[11px] text-sidebar-foreground/50 truncate">
                  {session?.user?.email || "admin@example.com"}
                </span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              aria-label="Log out"
              className="rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, layout } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed ltr:left-0 rtl:right-0 top-0 z-40 hidden h-screen flex-col bg-sidebar transition-all duration-300 ease-in-out",
          layout === "sidebar" ? "lg:flex" : "",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute ltr:-right-3 rtl:-left-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/50 shadow-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              collapsed ? "ltr:rotate-180 rtl:rotate-0" : "ltr:rotate-0 rtl:rotate-180"
            )}
          />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed ltr:left-0 rtl:right-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        )}
      >
        <SidebarContent collapsed={false} />

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="absolute ltr:right-3 rtl:left-3 top-4 flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </aside>
    </>
  );
}
