import { LayoutDashboard, Settings } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  keywords?: string[];
  group: "main" | "system";
}

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, keywords: ["home", "overview"], group: "main" },
  { label: "Settings", href: "/settings", icon: Settings, keywords: ["preferences", "account", "profile"], group: "system" },
];
