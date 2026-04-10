/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Target, Crosshair, DollarSign, ListOrdered, Clock } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { toast } from "sonner";
import { HeaderSearchPortal, HeaderActionsPortal } from "@/components/dashboard/header-portal";
import { Input } from "@dashboardpack/core/components/ui/input";
import { BayFormDialog } from "@/components/dashboard/bay-form-dialog";
import { BayCard } from "@/components/dashboard/bay-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { cn } from "@dashboardpack/core/lib/utils";

export default function BaysPage() {
  const router = useRouter();
  const [bays, setBays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryTab, setCategoryTab] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editBay, setEditBay] = useState<any>(null);

  const fetchBays = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bays");
      const json = await res.json();
      if (json.data) {
        setBays(json.data);
      }
    } catch (err) {
      toast.error("Failed to fetch bays");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBays();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/bays/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Bay deleted.");
        fetchBays();
      } else {
        toast.error("Failed to delete.");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setDeleteId(null);
    }
  };

  const categories = ["All", ...Array.from(new Set(bays.map(b => b.category || "Uncategorized"))).sort()];

  const filteredBays = bays.filter(b => {
    const matchesSearch = `${b.bay_name} ${b.category}`.toLowerCase().includes(globalFilter.toLowerCase());
    const bayCat = b.category || "Uncategorized";
    const matchesCat = categoryTab === "All" ? true : bayCat === categoryTab;
    return matchesSearch && matchesCat;
  });

  const getCount = (cat: string) => {
    if (cat === "All") return bays.length;
    return bays.filter((b) => (b.category || "Uncategorized") === cat).length;
  };

  return (
    <>
      <HeaderSearchPortal>
        <Input
          placeholder="Search bays..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-full sm:w-64 bg-background"
        />
      </HeaderSearchPortal>

      <HeaderActionsPortal>
        <Button onClick={() => { setEditBay(null); setFormOpen(true); }} size="sm" className="gap-1.5 h-9">
          <Plus className="h-4 w-4" />
          Add Bay
        </Button>
      </HeaderActionsPortal>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryTab(cat)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none",
              categoryTab === cat 
                ? "border-primary bg-primary/10 text-primary shadow-sm" 
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {cat} <span className="ml-1 opacity-70">({getCount(cat)})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading specific bays...</div>
      ) : filteredBays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed">
          <Target className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No bays found</p>
          <p className="text-xs text-muted-foreground mt-1">Adjust your filters or add a new bay.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBays.map((bay) => (
            <BayCard 
              key={bay.id} 
              bay={bay} 
              mode="admin"
              onEdit={(b) => {
                setEditBay({
                  id: b.id,
                  bay_name: b.bay_name,
                  category: b.category,
                  description: b.description,
                  primary_image: b.primary_image,
                  layout_image: b.layout_image,
                  rules: b.rules,
                  base_price: b.base_price,
                  same_day_price: b.same_day_price,
                  minimum_booking_fee: b.minimum_booking_fee,
                  per_person_rate: b.per_person_rate,
                  status: b.status,
                });
                setFormOpen(true);
              }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Bay"
        description="Are you sure you want to delete this Bay?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <BayFormDialog 
        open={formOpen}
        onOpenChange={setFormOpen}
        editBay={editBay}
        onSuccess={fetchBays}
      />
    </>
  );
}
