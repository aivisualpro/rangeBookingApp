/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { toast } from "sonner";

export default function NewCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    is_active: true,
    insurance_status: "pending",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create company");

      toast.success("Company created successfully!");
      router.push("/companies");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Company Name *</label>
            <Input required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} placeholder="Acme Logistics Inc." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Name</label>
              <Input value={formData.primary_contact_name} onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })} placeholder="John Doe" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Email (Admin)</label>
              <Input type="email" value={formData.primary_contact_email} onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })} placeholder="john@acme.com" />
            </div>
          </div>

          <div>
             <label className="mb-1 block text-sm font-medium">Contact Phone</label>
             <Input value={formData.primary_contact_phone} onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })} placeholder="+1 (555) 000-0000" />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Active Status</p>
              <p className="text-sm text-muted-foreground">Allow this company and its users to log in.</p>
            </div>
            <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Company"}</Button>
        </div>
      </form>
    </div>
  );
}
