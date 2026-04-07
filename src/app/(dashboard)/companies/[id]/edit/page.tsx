/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Button } from "@dashboardpack/core/components/ui/button";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { toast } from "sonner";

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setFormData(data.data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           company_name: formData.company_name,
           primary_contact_name: formData.primary_contact_name,
           primary_contact_email: formData.primary_contact_email,
           primary_contact_phone: formData.primary_contact_phone,
           is_active: formData.is_active
        }),
      });

      if (!res.ok) throw new Error("Failed to update company");

      toast.success("Company updated successfully!");
      router.push("/companies");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <PageHeader title="Edit Company" description="Update Range Company internal settings." breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Companies", href: "/companies" }, { label: "Edit" }]} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Company Name *</label>
            <Input required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Name</label>
              <Input value={formData.primary_contact_name || ''} onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Email</label>
              <Input type="email" value={formData.primary_contact_email || ''} onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })} />
            </div>
          </div>

          <div>
             <label className="mb-1 block text-sm font-medium">Contact Phone</label>
             <Input value={formData.primary_contact_phone || ''} onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })} />
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
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  );
}
