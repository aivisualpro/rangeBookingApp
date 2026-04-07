"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@dashboardpack/core/components/ui/dialog";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { toast } from "sonner";
import { Eye, EyeOff, RefreshCw, Check, AlertTriangle, ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

interface UserFormData {
  id?: string;
  user_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_name: string;
  password: string;
  company_id: string;
  status: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUser?: UserFormData | null;
  onSuccess: () => void;
}

function generatePassword(length = 16): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*_+-=";
  const all = upper + lower + digits + symbols;

  // Guarantee at least one from each category
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = pwd.length; i < length; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

function getPasswordStrength(pwd: string): { label: string; score: number; color: string; icon: React.ElementType } {
  if (!pwd) return { label: "None", score: 0, color: "bg-muted", icon: Shield };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[!@#$%^&*_+\-=]/.test(pwd)) score++;

  if (score <= 2) return { label: "Weak", score: 1, color: "bg-destructive", icon: AlertTriangle };
  if (score <= 4) return { label: "Fair", score: 2, color: "bg-warning", icon: ShieldAlert };
  return { label: "Strong", score: 3, color: "bg-success", icon: ShieldCheck };
}

export function UserFormDialog({ open, onOpenChange, editUser, onSuccess }: UserFormDialogProps) {
  const isEditing = !!editUser?.id;
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);

  const [form, setForm] = useState<UserFormData>({
    user_type: "External",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_name: "",
    password: "",
    company_id: "none",
    status: "active",
  });

  useEffect(() => {
    if (open) {
      if (editUser) {
        setForm({
          ...editUser,
          password: "",
          company_id: editUser.company_id || "none",
        });
      } else {
        setForm({
          user_type: "External",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          user_name: "",
          password: "",
          company_id: "none",
          status: "active",
        });
      }
      setShowPassword(false);
    }
  }, [open, editUser]);

  useEffect(() => {
    fetch("/api/companies")
      .then(r => r.ok ? r.json() : { data: [] })
      .then(j => j.data && setCompanies(j.data))
      .catch(() => {});
  }, []);

  const set = (key: keyof UserFormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const strength = getPasswordStrength(form.password);
  const StrengthIcon = strength.icon;

  const handleSuggestPassword = () => {
    const pwd = generatePassword();
    set("password", pwd);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) {
      toast.error("First name, last name, and email are required.");
      return;
    }
    if (form.user_type === "External" && (!form.company_id || form.company_id === "none")) {
      toast.error("Company is required for External users.");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/users/${editUser!.id}` : "/api/users";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(isEditing ? "User updated!" : "User created!");
        onSuccess();
        onOpenChange(false);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save user");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the user details below." : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Internal / External toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Internal User</Label>
              <p className="text-xs text-muted-foreground">Toggle on if this is an internal staff member.</p>
            </div>
            <Switch
              checked={form.user_type === "Internal"}
              onCheckedChange={(checked) => {
                set("user_type", checked ? "Internal" : "External");
                if (checked) set("company_id", "none");
              }}
            />
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Doe" />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 123-4567" />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={form.user_name} onChange={e => set("user_name", e.target.value)} placeholder="john_doe" />
          </div>

          {/* Password with strength meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{isEditing ? "New Password (leave blank to keep)" : "Password"}</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={handleSuggestPassword}>
                <RefreshCw className="size-3" />
                Suggest
              </Button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => set("password", e.target.value)}
                placeholder="Create a secure password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= strength.score ? strength.color : "bg-muted")} />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <StrengthIcon className="size-3.5" />
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          {/* Company (only for External) */}
          {form.user_type === "External" && (
            <div className="space-y-2">
              <Label>Company *</Label>
              <Select value={form.company_id} onValueChange={v => set("company_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Select Company —</SelectItem>
                  {companies.map(c => (
                    <SelectItem key={c._id || c.id} value={c._id || c.id}>{c.company_name || c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : isEditing ? "Update User" : "Create User"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
