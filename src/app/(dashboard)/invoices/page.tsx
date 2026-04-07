"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Download, Search, Send } from "lucide-react";
import { getInvoices } from "@dashboardpack/core/lib/data";
import type { InvoiceStatus } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const statusFilters: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

const statusVariant: Record<InvoiceStatus, "success" | "warning" | "destructive"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
};

export default function InvoicesPage() {
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const [search, setSearch] = useState("");

  const { data: invoices, total } = getInvoices({
    status: filter === "all" ? undefined : filter,
    search: search || undefined,
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your invoices.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">All Invoices</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-60 ps-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    filter === f.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Invoice</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Order</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Issued</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Due</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <span className="font-mono text-sm font-medium">{inv.id}</span>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="text-sm font-medium">{inv.customerName}</p>
                        <p className="text-xs text-muted-foreground">{inv.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="font-mono text-xs text-muted-foreground">{inv.orderId}</span>
                    </td>
                    <td className="py-3">
                      <Badge variant={statusVariant[inv.status]} className="capitalize text-[11px]">{inv.status}</Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{inv.issuedDate}</td>
                    <td className="py-3 text-sm text-muted-foreground">{inv.dueDate}</td>
                    <td className="py-3 text-end text-sm font-semibold">
                      ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Download invoice">
                          <Download className="h-4 w-4" />
                        </Button>
                        {inv.status !== "paid" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Send reminder">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {invoices.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No invoices found.</p>
            </div>
          )}
          <div className="mt-4 text-xs text-muted-foreground">
            Showing {invoices.length} of {total} invoices
          </div>
        </CardContent>
      </Card>
    </>
  );
}
