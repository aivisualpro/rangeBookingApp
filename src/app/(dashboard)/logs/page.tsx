"use client";

import { useState, useMemo } from "react";
import { HeaderSearchPortal } from "@/components/dashboard/header-portal";
import { useAPI } from "@/lib/use-api";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Input } from "@dashboardpack/core/components/ui/input";
import { cn } from "@dashboardpack/core/lib/utils";
import { Search } from "lucide-react";

type RouteCategory = "bookings" | "companies" | "users";

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<RouteCategory>("bookings");

  const { data: bookings = [], isLoading: bLoading } = useAPI<any[]>("/api/bookings");
  const { data: companies = [], isLoading: cLoading } = useAPI<any[]>("/api/companies");
  const { data: users = [], isLoading: uLoading } = useAPI<any[]>("/api/users");

  const displayLogs = useMemo(() => {
    let raw: any[] = [];
    if (activeTab === "bookings") {
      raw = bookings.map((b: any) => ({
        id: b._id,
        sortTime: b.createdAt ? new Date(b.createdAt).getTime() : 0,
        ts: b.createdAt ? new Date(b.createdAt).toISOString() : "Unknown Date",
        level: b.status === "Approved" ? "INFO" : b.status === "Denied" ? "ERROR" : "WARN",
        service: "api/bookings",
        msg: `Booking ${b.reference_id} [${b.status}] requested by ${b.company_name_snapshot} for ${b.bay_name_snapshot}`
      }));
    } else if (activeTab === "companies") {
      raw = companies.map((c: any) => ({
        id: c._id,
        sortTime: c.createdAt ? new Date(c.createdAt).getTime() : 0,
        ts: c.createdAt ? new Date(c.createdAt).toISOString() : "Unknown Date",
        level: c.status === "Active" ? "INFO" : "WARN",
        service: "api/companies",
        msg: `Company profile ${c.name} modified (Status: ${c.status}) — Insurance Expires: ${c.coi_expiration_date ? new Date(c.coi_expiration_date).toDateString() : "N/A"}`
      }));
    } else if (activeTab === "users") {
      raw = users.map((u: any) => ({
        id: u._id,
        sortTime: u.createdAt ? new Date(u.createdAt).getTime() : 0,
        ts: u.createdAt ? new Date(u.createdAt).toISOString() : "Unknown Date",
        level: u.role === "admin" ? "DEBUG" : "INFO",
        service: "api/users",
        msg: `User account ${u.username} (${u.role}) modified. Associated target mapping ID: ${u.company_id || "System Administration"}`
      }));
    }
    
    return raw.filter((log) => {
      if (search && !log.msg.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.sortTime - a.sortTime);
  }, [activeTab, bookings, companies, users, search]);

  const isLoading = (activeTab === "bookings" && bLoading) || (activeTab === "companies" && cLoading) || (activeTab === "users" && uLoading);

  return (
    <>
      <HeaderSearchPortal>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab} history...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full sm:w-80 pl-9 bg-background"
          />
        </div>
      </HeaderSearchPortal>

      <div className="mb-4 flex gap-2 border-b border-border/60 pb-5">
        {(["bookings", "companies", "users"] as RouteCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveTab(cat);
              setSearch("");
            }}
            className={cn(
              "rounded-md border px-4 py-1.5 text-xs font-semibold capitalize transition-all",
              activeTab === cat ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/40"
            )}
          >
            {cat} Logs
          </button>
        ))}
      </div>

      <Card className="overflow-hidden border-border/60">
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {isLoading ? (
              <div className="p-8 text-center text-sm font-mono text-muted-foreground">Loading audit logs...</div>
            ) : displayLogs.length === 0 ? (
              <div className="p-8 text-center text-sm font-mono text-muted-foreground">No records matched your search in {activeTab}</div>
            ) : (
              displayLogs.map((log, i) => {
                const color = log.level === "ERROR" ? "text-destructive" : log.level === "WARN" ? "text-warning" : log.level === "DEBUG" ? "text-muted-foreground" : "text-chart-2";
                const variant = log.level === "ERROR" ? "destructive" : log.level === "WARN" ? "warning" : log.level === "DEBUG" ? "secondary" : "default";

                return (
                  <div
                    key={log.id ?? `log-${i}`}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3 font-mono text-xs transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:gap-3",
                      i % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <span className="shrink-0 text-muted-foreground/60 w-52">{log.ts}</span>
                    <Badge variant={variant as any} className="w-fit text-[9px] px-1.5 py-0 uppercase tracking-widest">{log.level}</Badge>
                    <span className="shrink-0 text-muted-foreground">[{log.service}]</span>
                    <span className={cn("flex-1", color)}>{log.msg}</span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
