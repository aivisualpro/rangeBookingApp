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
import { Label } from "@dashboardpack/core/components/ui/label";
import { toast } from "sonner";

interface CompanyFormData {
  id?: string;
  company_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  is_active: boolean;
  insurance_status?: string;
}

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCompany?: CompanyFormData | null;
  onSuccess: () => void;
}

export function CompanyFormDialog({ open, onOpenChange, editCompany, onSuccess }: CompanyFormDialogProps) {
  const isEditing = !!editCompany?.id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    is_active: true,
    insurance_status: "pending",
  });

  useEffect(() => {
    if (open) {
      if (editCompany) {
        setFormData({
          id: editCompany.id,
          company_name: editCompany.company_name || "",
          primary_contact_name: editCompany.primary_contact_name || "",
          primary_contact_email: editCompany.primary_contact_email || "",
          primary_contact_phone: editCompany.primary_contact_phone || "",
          is_active: editCompany.is_active ?? true,
          insurance_status: editCompany.insurance_status || "pending",
        });
      } else {
        setFormData({
          company_name: "",
          primary_contact_name: "",
          primary_contact_email: "",
          primary_contact_phone: "",
          is_active: true,
          insurance_status: "pending",
        });
      }
    }
  }, [open, editCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEditing ? `/api/companies/${editCompany.id}` : "/api/companies";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = isEditing ? {
        company_name: formData.company_name,
        primary_contact_name: formData.primary_contact_name,
        primary_contact_email: formData.primary_contact_email,
        primary_contact_phone: formData.primary_contact_phone,
        is_active: formData.is_active
      } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save company");
      }

      toast.success(isEditing ? "Company updated!" : "Company created!");
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company" : "Add New Company"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the company details below." : "Fill in the details to create a new company."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Company Name *</Label>
              <Input 
                required 
                value={formData.company_name} 
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} 
                placeholder="Acme Logistics Inc." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Contact Name</Label>
                <Input 
                  value={formData.primary_contact_name} 
                  onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })} 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <Label className="mb-1 block">Contact Email (Admin)</Label>
                <Input 
                  type="email" 
                  value={formData.primary_contact_email} 
                  onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })} 
                  placeholder="john@acme.com" 
                />
              </div>
            </div>

            <div>
               <Label className="mb-1 block">Contact Phone</Label>
               <Input 
                 value={formData.primary_contact_phone} 
                 onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })} 
                 placeholder="+1 (555) 000-0000" 
               />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground">Allow this company and its users to log in.</p>
              </div>
              <Switch 
                checked={formData.is_active} 
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : isEditing ? "Save Changes" : "Create Company"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
