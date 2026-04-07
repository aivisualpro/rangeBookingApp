"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { navigationItems } from "@/lib/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@dashboardpack/core/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  }, [theme, setTheme]);

  const mainItems = navigationItems.filter((item) => item.group === "main");
  const systemItems = navigationItems.filter((item) => item.group === "system");

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for pages, actions, and quick links."
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={[item.label, ...(item.keywords ?? [])].join(" ")}
                onSelect={() => navigateTo(item.href)}
              >
                <Icon className="me-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
          {systemItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={[item.label, ...(item.keywords ?? [])].join(" ")}
                onSelect={() => navigateTo(item.href)}
              >
                <Icon className="me-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme dark light mode" onSelect={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="me-2 h-4 w-4" />
            ) : (
              <Moon className="me-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
            <span className="ms-auto text-xs text-muted-foreground">
              {theme === "dark" ? "Switch to light" : "Switch to dark"}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
