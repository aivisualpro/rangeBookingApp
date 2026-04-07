import {
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
  Bell,
  Settings,
  HelpCircle,
  BookOpen,
  ChartNoAxesCombined,
  UserCog,
  Kanban,
  Calendar,
  ListChecks,
  CreditCard,
  FileText,
  Layers,
  Globe,
  Radar,
  DollarSign,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  keywords?: string[];
  group: "main" | "system";
}

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "overview"], group: "main" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, keywords: ["charts", "stats", "metrics"], group: "main" },
  { label: "Servers", href: "/servers", icon: Server, keywords: ["hosts", "machines", "instances", "fleet"], group: "main" },
  { label: "Containers", href: "/containers", icon: Container, keywords: ["docker", "pods", "kubernetes", "k8s"], group: "main" },
  { label: "Deployments", href: "/deployments", icon: Rocket, badge: "3", keywords: ["releases", "ci", "cd", "pipeline"], group: "main" },
  { label: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "2", keywords: ["alerts", "outages", "on-call", "pagerduty"], group: "main" },
  { label: "Logs", href: "/logs", icon: ScrollText, keywords: ["output", "terminal", "console", "stdout"], group: "main" },
  { label: "Uptime", href: "/uptime", icon: Activity, keywords: ["monitoring", "heartbeat", "ping", "health"], group: "main" },
  { label: "Pipelines", href: "/pipelines", icon: GitBranch, keywords: ["ci", "cd", "workflow", "build", "github"], group: "main" },
  { label: "Databases", href: "/databases", icon: Database, keywords: ["postgres", "mysql", "redis", "mongo"], group: "main" },
  { label: "Security", href: "/security", icon: Shield, keywords: ["vulnerabilities", "audit", "compliance", "cve"], group: "main" },
  { label: "API Monitoring", href: "/api-monitoring", icon: Radar, keywords: ["endpoints", "latency", "p99", "p95", "requests", "rpm"], group: "main" },
  { label: "Kubernetes", href: "/kubernetes", icon: Layers, keywords: ["k8s", "cluster", "nodes", "pods", "namespaces"], group: "main" },
  { label: "Cloud Costs", href: "/costs", icon: DollarSign, keywords: ["finops", "spend", "budget", "aws", "gcp", "azure"], group: "main" },
  { label: "Status Page", href: "/status", icon: Globe, keywords: ["uptime", "incidents", "public", "operational"], group: "main" },
  { label: "Task Board", href: "/kanban", icon: Kanban, keywords: ["board", "tasks", "drag", "drop", "sprint"], group: "main" },
  { label: "On-Call Schedule", href: "/calendar", icon: Calendar, keywords: ["events", "schedule", "rotation"], group: "main" },
  { label: "Setup Wizard", href: "/wizard", icon: ListChecks, keywords: ["form", "steps", "onboarding", "service"], group: "main" },
  { label: "Cloud Billing", href: "/billing", icon: CreditCard, keywords: ["payment", "subscription", "cost", "spend"], group: "main" },
  { label: "Invoices", href: "/invoices", icon: FileText, keywords: ["bills", "receipts", "statements"], group: "main" },
  { label: "Charts", href: "/charts", icon: ChartNoAxesCombined, keywords: ["radar", "treemap", "scatter", "gauge", "graphs"], group: "main" },
  { label: "Documentation", href: "/docs", icon: BookOpen, keywords: ["docs", "guide", "help", "components"], group: "main" },
  { label: "Team", href: "/users", icon: UserCog, keywords: ["team", "members", "roles", "permissions", "rbac"], group: "system" },
  { label: "Alerts", href: "/notifications", icon: Bell, badge: "5", keywords: ["alerts", "messages", "notifications"], group: "system" },
  { label: "Settings", href: "/settings", icon: Settings, keywords: ["preferences", "account", "profile"], group: "system" },
  { label: "Support", href: "/support", icon: HelpCircle, keywords: ["faq", "contact", "docs"], group: "system" },
];
