"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@dashboardpack/core/components/ui/tabs";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { Sun, Moon, Monitor, Rows3, Rows4, StretchHorizontal, Globe } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import { useLocale } from "@dashboardpack/core/lib/i18n/locale-context";
import { locales } from "@dashboardpack/core/lib/i18n/config";
import type { Locale } from "@dashboardpack/core/lib/i18n/config";

/* ------------------------------------------------------------------ */
/*  Color presets                                                      */
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

interface DensityOption {
  value: DensityValue;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;
}

const DENSITY_OPTIONS: DensityOption[] = [
  { value: "compact",     label: "Compact",     icon: Rows3 },
  { value: "comfortable", label: "Comfortable", icon: Rows4 },
  { value: "spacious",    label: "Spacious",    icon: StretchHorizontal },
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
/*  Profile tab                                                        */
/* ------------------------------------------------------------------ */

function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("Demo mode — changes not saved");
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              AS
            </div>
            <div>
              <Button variant="outline" size="sm">Change avatar</Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" defaultValue="Aigars" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" defaultValue="Silkalns" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="aigars@colorlib.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              defaultValue="Founder at Colorlib. Building beautiful web templates."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Preferences tab                                                    */
/* ------------------------------------------------------------------ */

function PreferencesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Preferences</CardTitle>
        <CardDescription>Manage your notification and communication preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { id: "email-orders", label: "Order notifications", description: "Receive emails for new orders and status changes", defaultChecked: true },
          { id: "email-marketing", label: "Marketing emails", description: "Receive product updates and promotional content", defaultChecked: false },
          { id: "email-security", label: "Security alerts", description: "Get notified about suspicious account activity", defaultChecked: true },
          { id: "push-orders", label: "Push notifications", description: "Receive push notifications for real-time order updates", defaultChecked: true },
          { id: "weekly-digest", label: "Weekly digest", description: "Get a summary of your weekly performance", defaultChecked: false },
        ].map((pref) => (
          <div key={pref.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={pref.id} className="text-sm font-medium">{pref.label}</Label>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <Switch id={pref.id} defaultChecked={pref.defaultChecked} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Appearance tab                                                     */
/* ------------------------------------------------------------------ */

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();

  /* --- Color preset state --- */
  const [colorPreset, setColorPreset] = useState<ColorPresetKey>(() => {
    if (typeof window === "undefined") return "matrix";
    return (localStorage.getItem(COLOR_STORAGE_KEY) as ColorPresetKey) || "matrix";
  });

  useEffect(() => {
    const saved = localStorage.getItem(COLOR_STORAGE_KEY) as ColorPresetKey | null;
    const preset = COLOR_PRESETS.find((p) => p.key === (saved ?? "matrix")) ?? COLOR_PRESETS[0];
    applyColorPreset(preset);
  }, []);

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

  useEffect(() => {
    const saved = localStorage.getItem(DENSITY_STORAGE_KEY) as DensityValue | null;
    applyDensity(saved ?? "comfortable");
  }, []);

  function handleDensity(value: DensityValue) {
    setDensity(value);
    localStorage.setItem(DENSITY_STORAGE_KEY, value);
    applyDensity(value);
  }

  /* --- Theme options --- */
  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* ---- Theme ---- */}
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                    theme === t.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Icon className={cn("h-6 w-6", theme === t.value ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", theme === t.value ? "text-primary" : "text-muted-foreground")}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* ---- Color Scheme ---- */}
        <div className="space-y-4">
          <Label>Color Scheme</Label>
          <div className="grid grid-cols-3 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handleColorPreset(preset)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                  colorPreset === preset.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full"
                  style={{ backgroundColor: `oklch(0.55 ${preset.chroma} ${preset.hue})` }}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    colorPreset === preset.key ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* ---- Density ---- */}
        <div className="space-y-4">
          <Label>Density</Label>
          <div className="grid grid-cols-3 gap-3">
            {DENSITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleDensity(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                    density === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      density === opt.value ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      density === opt.value ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* ---- Language ---- */}
        <div className="space-y-4">
          <Label>Language</Label>
          <div className="grid grid-cols-3 gap-3">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => setLocale(loc.code as Locale)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                  locale === loc.code
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <Globe
                  className={cn(
                    "h-6 w-6",
                    locale === loc.code ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    locale === loc.code ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {loc.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings page                                                      */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
