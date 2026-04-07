"use client";

import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { LayoutDashboard, Palette, Globe, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations();
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.welcome")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is your starter dashboard. Add pages in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/app/(dashboard)/
              </code>{" "}
              and register them in the sidebar.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <Palette className="h-5 w-5 text-chart-2" />
            </div>
            <CardTitle className="text-base">Theming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              6 color presets, 3 density options, dark/light/system themes,
              RTL support, and layout switching — all in the Theme Customizer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
              <Globe className="h-5 w-5 text-chart-3" />
            </div>
            <CardTitle className="text-base">Internationalization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built-in i18n with English, German, and French. Add languages in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/lib/i18n/messages/
              </code>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">How to add a new page</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 ps-5 text-sm text-muted-foreground">
            <li>
              Create a file at{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/app/(dashboard)/your-page/page.tsx
              </code>
            </li>
            <li>
              Add a nav entry in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/components/dashboard/sidebar.tsx
              </code>{" "}
              (navGroups or systemNav)
            </li>
            <li>
              Add to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/lib/navigation.ts
              </code>{" "}
              for Command Palette (Cmd+K) access
            </li>
            <li>
              Optionally add translation keys in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/lib/i18n/messages/*.json
              </code>
            </li>
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
