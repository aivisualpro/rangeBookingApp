"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";

export default function EditBayPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/bays/${id}`)
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
      const res = await fetch(`/api/bays/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update bay");

      toast.success("Bay updated successfully!");
      router.push("/bays");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-3xl">
      

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Bay Name *</label>
              <Input required value={formData.bay_name || ''} onChange={(e) => setFormData({ ...formData, bay_name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.category || 'Other'} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Cowboy">Cowboy</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
             <label className="mb-1 block text-sm font-medium">Description</label>
             <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Base Price ($)</label>
              <Input type="number" min="0" value={formData.base_price || 0} onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Same-Day Price ($)</label>
              <Input type="number" min="0" value={formData.same_day_price || 0} onChange={(e) => setFormData({ ...formData, same_day_price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Min Booking Fee ($)</label>
              <Input type="number" min="0" value={formData.minimum_booking_fee || 0} onChange={(e) => setFormData({ ...formData, minimum_booking_fee: Number(e.target.value) })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Per-Person Rate ($)</label>
              <Input type="number" min="0" value={formData.per_person_rate || 0} onChange={(e) => setFormData({ ...formData, per_person_rate: Number(e.target.value) })} />
            </div>
          </div>

          <div>
             <label className="mb-1 block text-sm font-medium">Rules / Usage Notes</label>
             <Textarea value={formData.rules || ''} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} rows={2} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="mb-1 block text-sm font-medium">Primary Image URL</label>
               <Input value={formData.primary_image || ''} onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })} />
             </div>
             <div>
               <label className="mb-1 block text-sm font-medium">Layout Diagram URL</label>
               <Input value={formData.layout_image || ''} onChange={(e) => setFormData({ ...formData, layout_image: e.target.value })} />
             </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Active Status</p>
              <p className="text-sm text-muted-foreground">Make this bay available for booking.</p>
            </div>
            <Switch checked={formData.status === "Active"} onCheckedChange={(v) => setFormData({ ...formData, status: v ? "Active" : "Inactive" })} />
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
