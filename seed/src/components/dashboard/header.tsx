"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { ThemeCustomizer } from "./theme-customizer";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import {
  Search,
  Sun,
  Moon,
  Menu,
  Palette,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setMobileOpen, layout } = useSidebar();
  const router = useRouter();
  const t = useTranslations();
  const [customizerOpen, setCustomizerOpen] = useState(false);

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
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">Signal</span>
            <div className="mx-1 h-6 w-px bg-border" />
          </div>
        )}

        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="relative hidden h-9 w-72 items-center rounded-lg border border-input bg-muted/40 ps-9 pe-4 text-start text-sm text-muted-foreground/50 transition-colors hover:bg-muted/60 sm:flex"
        >
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          {t("header.search")}
          <kbd className="pointer-events-none absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Customizer */}
        <button
          onClick={() => setCustomizerOpen(true)}
          aria-label="Customize theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Palette className="h-4 w-4" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="User menu"
              className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              U
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="me-2 h-4 w-4" />
              {t("header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast.success(t("header.loggedOut"), {
                  description: t("header.signedOutMessage"),
                });
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
    </div>
  );
}
