"use client";

import React, { useState } from "react";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@dashboardpack/core/components/ui/sheet";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Sun, Moon, Monitor, Rows3, Rows4, StretchHorizontal, PanelLeft, PanelTop, Maximize, Minimize, AlignLeft, AlignRight, Globe } from "lucide-react";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import type { LayoutMode, ContainerMode, DirectionMode } from "@dashboardpack/core/providers/sidebar-context";
import { cn } from "@dashboardpack/core/lib/utils";
import { useLocale } from "@dashboardpack/core/lib/i18n/locale-context";
import { locales } from "@dashboardpack/core/lib/i18n/config";
import type { Locale } from "@dashboardpack/core/lib/i18n/config";

/* ------------------------------------------------------------------ */
/*  Color presets (mirrored from settings page)                        */
/* ------------------------------------------------------------------ */

type ColorPresetKey = "matrix" | "cyan" | "violet" | "amber" | "red" | "frost";

interface ColorPreset {
  key: ColorPresetKey;
  label: string;
  hue: number;
  chroma: number;
}

const COLOR_PRESETS: ColorPreset[] = [
  { key: "matrix",  label: "Matrix",  hue: 165, chroma: 0.22 },
  { key: "cyan",    label: "Cyan",    hue: 195, chroma: 0.18 },
  { key: "violet",  label: "Violet",  hue: 280, chroma: 0.18 },
  { key: "amber",   label: "Amber",   hue: 60,  chroma: 0.18 },
  { key: "red",     label: "Red",     hue: 25,  chroma: 0.20 },
  { key: "frost",   label: "Frost",   hue: 220, chroma: 0.04 },
];

const COLOR_STORAGE_KEY = "signal-color-preset";

function applyColorPreset(preset: ColorPreset) {
  const root = document.documentElement.style;
  const primary = `oklch(0.55 ${preset.chroma} ${preset.hue})`;
  root.setProperty("--primary", primary);
  root.setProperty("--primary-foreground", "oklch(1 0 0)");
  root.setProperty("--sidebar-primary", primary);
  root.setProperty("--chart-1", primary);
  root.setProperty("--ring", primary);
}

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

type DensityValue = "compact" | "comfortable" | "spacious";

const DENSITY_OPTIONS = [
  { value: "compact" as const,     label: "Compact",     icon: Rows3 },
  { value: "comfortable" as const, label: "Comfortable", icon: Rows4 },
  { value: "spacious" as const,    label: "Spacious",    icon: StretchHorizontal },
];

const DENSITY_STORAGE_KEY = "signal-density";
const DENSITY_CLASSES: Record<DensityValue, string> = {
  compact: "density-compact",
  comfortable: "density-comfortable",
  spacious: "density-spacious",
};

function applyDensity(value: DensityValue) {
  const root = document.documentElement;
  Object.values(DENSITY_CLASSES).forEach((cls) => root.classList.remove(cls));
  root.classList.add(DENSITY_CLASSES[value]);
}

/* ------------------------------------------------------------------ */
/*  Theme Customizer                                                   */
/* ------------------------------------------------------------------ */

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LAYOUT_OPTIONS: { value: LayoutMode; label: string; icon: React.ElementType }[] = [
  { value: "sidebar", label: "Sidebar", icon: PanelLeft },
  { value: "topnav",  label: "Top Nav", icon: PanelTop },
];

const CONTAINER_OPTIONS: { value: ContainerMode; label: string; icon: React.ElementType }[] = [
  { value: "fluid", label: "Fluid",  icon: Maximize },
  { value: "boxed", label: "Boxed",  icon: Minimize },
];

const DIRECTION_OPTIONS: { value: DirectionMode; label: string; icon: React.ElementType }[] = [
  { value: "ltr", label: "LTR", icon: AlignLeft },
  { value: "rtl", label: "RTL", icon: AlignRight },
];

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme();
  const { layout, setLayout, container, setContainer, direction, setDirection } = useSidebar();
  const { locale, setLocale } = useLocale();

  /* --- Color preset state --- */
  const [colorPreset, setColorPreset] = useState<ColorPresetKey>(() => {
    if (typeof window === "undefined") return "matrix";
    return (localStorage.getItem(COLOR_STORAGE_KEY) as ColorPresetKey) || "matrix";
  });

  function handleColorPreset(preset: ColorPreset) {
    setColorPreset(preset.key);
    localStorage.setItem(COLOR_STORAGE_KEY, preset.key);
    applyColorPreset(preset);
  }

  /* --- Density state --- */
  const [density, setDensity] = useState<DensityValue>(() => {
    if (typeof window === "undefined") return "comfortable";
    return (localStorage.getItem(DENSITY_STORAGE_KEY) as DensityValue) || "comfortable";
  });

  function handleDensity(value: DensityValue) {
    setDensity(value);
    localStorage.setItem(DENSITY_STORAGE_KEY, value);
    applyDensity(value);
  }

  /* --- Reset --- */
  function handleReset() {
    setTheme("system");
    const defaultColor = COLOR_PRESETS[0];
    setColorPreset(defaultColor.key);
    localStorage.setItem(COLOR_STORAGE_KEY, defaultColor.key);
    applyColorPreset(defaultColor);
    setDensity("comfortable");
    localStorage.setItem(DENSITY_STORAGE_KEY, "comfortable");
    applyDensity("comfortable");
    setLayout("sidebar");
    setContainer("fluid");
    setDirection("ltr");
    setLocale("en");
  }

  /* --- Theme options --- */
  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize</SheetTitle>
          <SheetDescription>
            Personalize your dashboard experience.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-4">
          {/* ---- Theme ---- */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      theme === t.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", theme === t.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", theme === t.value ? "text-primary" : "text-muted-foreground")}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Color ---- */}
          <div className="space-y-3">
            <Label>Color</Label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handleColorPreset(preset)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    colorPreset === preset.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 rounded-full",
                      colorPreset === preset.key && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: `oklch(0.55 ${preset.chroma} ${preset.hue})` }}
                  />
                  <span className={cn("text-xs font-medium", colorPreset === preset.key ? "text-primary" : "text-muted-foreground")}>
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ---- Density ---- */}
          <div className="space-y-3">
            <Label>Density</Label>
            <div className="grid grid-cols-3 gap-2">
              {DENSITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleDensity(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      density === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", density === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", density === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Layout ---- */}
          <div className="space-y-3">
            <Label>Layout</Label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setLayout(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      layout === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", layout === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", layout === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Container ---- */}
          <div className="space-y-3">
            <Label>Container</Label>
            <div className="grid grid-cols-2 gap-2">
              {CONTAINER_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setContainer(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      container === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", container === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", container === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Direction ---- */}
          <div className="space-y-3">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              {DIRECTION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDirection(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      direction === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", direction === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", direction === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Language ---- */}
          <div className="space-y-3">
            <Label>Language</Label>
            <div className="grid grid-cols-3 gap-2">
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    locale === loc.code
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Globe className={cn("h-5 w-5", locale === loc.code ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-medium", locale === loc.code ? "text-primary" : "text-muted-foreground")}>
                    {loc.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
