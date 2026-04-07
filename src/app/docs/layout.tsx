"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { Button } from "@dashboardpack/core/components/ui/button";
import { docsNavigation } from "@/lib/docs-navigation";
import { cn } from "@dashboardpack/core/lib/utils";
import "@dashboardpack/core/components/docs/code-highlight.css";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

function DocsSidebar({
  mobile = false,
  onLinkClick,
}: {
  mobile?: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col gap-6 py-6",
        mobile ? "px-4" : "px-4"
      )}
    >
      {docsNavigation.map((group) => (
        <div key={group.title}>
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {group.title}
          </h4>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close mobile sidebar on route change
  const pathname = usePathname();
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          {/* Logo / Home link */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
          >
            <Zap className="size-5 text-primary" />
            <span>Signal Dashboard</span>
          </Link>

          {/* Docs label */}
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Docs
          </span>

          <div className="flex-1" />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-7xl lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-e lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <DocsSidebar />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed inset-y-14 ltr:left-0 rtl:right-0 z-50 w-64 overflow-y-auto border-e bg-background lg:hidden">
              <DocsSidebar mobile onLinkClick={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
