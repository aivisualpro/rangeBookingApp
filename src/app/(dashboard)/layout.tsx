import { SidebarProvider } from "@dashboardpack/core/providers/sidebar-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NotificationProvider } from "@/providers/notification-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotificationProvider>
        <DashboardShell>{children}</DashboardShell>
      </NotificationProvider>
    </SidebarProvider>
  );
}
