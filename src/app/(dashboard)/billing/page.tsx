"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { Check, CreditCard, Download } from "lucide-react";

const currentPlan = {
  name: "Pro Plan",
  price: "$29",
  period: "/month",
  features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom branding", "API access"],
};

const billingHistory = [
  { date: "Feb 1, 2026", description: "Pro Plan — Monthly", amount: "$29.00", status: "paid" as const },
  { date: "Jan 1, 2026", description: "Pro Plan — Monthly", amount: "$29.00", status: "paid" as const },
  { date: "Dec 1, 2025", description: "Pro Plan — Monthly", amount: "$29.00", status: "paid" as const },
  { date: "Nov 1, 2025", description: "Pro Plan — Monthly", amount: "$29.00", status: "paid" as const },
  { date: "Oct 1, 2025", description: "Starter Plan — Monthly", amount: "$9.00", status: "paid" as const },
  { date: "Sep 1, 2025", description: "Starter Plan — Monthly", amount: "$9.00", status: "paid" as const },
];

const usageData = [
  { label: "API Calls", current: 8420, limit: 10000, unit: "calls" },
  { label: "Storage", current: 3.2, limit: 5, unit: "GB" },
  { label: "Team Members", current: 4, limit: 10, unit: "seats" },
];

const statusVariant = { paid: "success" as const, pending: "warning" as const, failed: "destructive" as const };

export default function BillingPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Current Plan */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
                <CardDescription>You are on the {currentPlan.name}</CardDescription>
              </div>
              <Badge variant="success">{currentPlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">{currentPlan.price}</span>
              <span className="text-muted-foreground">{currentPlan.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {currentPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
            <CardDescription>Manage your payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2028</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Update Payment Method
            </Button>
          </CardContent>

          <CardHeader className="pt-2">
            <CardTitle className="text-base font-semibold">Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageData.map((item) => {
              const pct = Math.round((item.current / item.limit) * 100);
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.current} / {item.limit} {item.unit}
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Description</th>
                  <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm text-muted-foreground">{item.date}</td>
                    <td className="py-3 text-sm font-medium">{item.description}</td>
                    <td className="py-3">
                      <Badge variant={statusVariant[item.status]} className="capitalize text-[11px]">{item.status}</Badge>
                    </td>
                    <td className="py-3 text-end text-sm font-semibold">{item.amount}</td>
                    <td className="py-3 text-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
