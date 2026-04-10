"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@dashboardpack/core/components/ui/dialog";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Label } from "@dashboardpack/core/components/ui/label";
import { toast } from "sonner";
import { ImageUpload } from "@/components/shared/image-upload";

interface BayFormData {
  id?: string;
  bay_name: string;
  category: string;
  description: string;
  primary_image: string;
  layout_image: string;
  rules: string;
  base_price: number;
  same_day_price: number;
  minimum_booking_fee: number;
  per_person_rate: number;
  status: string;
}

interface BayFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBay?: BayFormData | null;
  onSuccess: () => void;
}

export function BayFormDialog({ open, onOpenChange, editBay, onSuccess }: BayFormDialogProps) {
  const isEditing = !!editBay?.id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<BayFormData>({
    bay_name: "",
    category: "Other",
    description: "",
    primary_image: "",
    layout_image: "",
    rules: "",
    base_price: 0,
    same_day_price: 0,
    minimum_booking_fee: 0,
    per_person_rate: 0,
    status: "Active"
  });

  useEffect(() => {
    if (open) {
      if (editBay) {
        setFormData({
          id: editBay.id,
          bay_name: editBay.bay_name || "",
          category: editBay.category || "Other",
          description: editBay.description || "",
          primary_image: editBay.primary_image || "",
          layout_image: editBay.layout_image || "",
          rules: editBay.rules || "",
          base_price: editBay.base_price || 0,
          same_day_price: editBay.same_day_price || 0,
          minimum_booking_fee: editBay.minimum_booking_fee || 0,
          per_person_rate: editBay.per_person_rate || 0,
          status: editBay.status || "Active"
        });
      } else {
        setFormData({
          bay_name: "",
          category: "Other",
          description: "",
          primary_image: "",
          layout_image: "",
          rules: "",
          base_price: 0,
          same_day_price: 0,
          minimum_booking_fee: 0,
          per_person_rate: 0,
          status: "Active"
        });
      }
    }
  }, [open, editBay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEditing ? `/api/bays/${editBay.id}` : "/api/bays";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to save bay");
      }

      toast.success(isEditing ? "Bay updated!" : "Bay created!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Bay" : "Add New Bay"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the bay details below." : "Fill in the details to create a new bay."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Bay Name *</Label>
                <Input 
                  required 
                  value={formData.bay_name} 
                  onChange={(e) => setFormData({ ...formData, bay_name: e.target.value })} 
                  placeholder="Alpha Range" 
                />
              </div>
              <div>
                <Label className="mb-1 block">Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Cowboy">Cowboy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
               <Label className="mb-1 block">Description</Label>
               <Textarea 
                 value={formData.description} 
                 onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                 rows={3} 
                 placeholder="Describe the capabilities of this bay..." 
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Base Price ($)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  value={formData.base_price} 
                  onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })} 
                />
              </div>
              <div>
                <Label className="mb-1 block">Same-Day Price ($)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  value={formData.same_day_price} 
                  onChange={(e) => setFormData({ ...formData, same_day_price: Number(e.target.value) })} 
                />
              </div>
              <div>
                <Label className="mb-1 block">Min Booking Fee ($)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  value={formData.minimum_booking_fee} 
                  onChange={(e) => setFormData({ ...formData, minimum_booking_fee: Number(e.target.value) })} 
                />
              </div>
              <div>
                <Label className="mb-1 block">Per-Person Rate ($)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  value={formData.per_person_rate} 
                  onChange={(e) => setFormData({ ...formData, per_person_rate: Number(e.target.value) })} 
                />
              </div>
            </div>

            <div>
               <Label className="mb-1 block">Rules / Usage Notes</Label>
               <Textarea 
                 value={formData.rules} 
                 onChange={(e) => setFormData({ ...formData, rules: e.target.value })} 
                 rows={2} 
                 placeholder="No steel core ammo..." 
               />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1 border-t mt-4">
               <ImageUpload
                  label="Primary Image"
                  value={formData.primary_image}
                  onChange={(url) => setFormData({ ...formData, primary_image: url })}
               />
               <ImageUpload
                  label="Layout Diagram"
                  value={formData.layout_image}
                  onChange={(url) => setFormData({ ...formData, layout_image: url })}
               />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground">Make this bay available for booking.</p>
              </div>
              <Switch 
                checked={formData.status === "Active"} 
                onCheckedChange={(v) => setFormData({ ...formData, status: v ? "Active" : "Inactive" })} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : isEditing ? "Save Changes" : "Create Bay"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
