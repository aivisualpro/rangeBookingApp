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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredBays.map((bay) => (
            <Card key={bay.id} className="transition-all flex flex-col hover:shadow-md hover:border-primary/20 overflow-hidden">
              {bay.primary_image && (
                 <div className="w-full h-36 bg-muted/50 border-b">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={bay.primary_image} alt={bay.bay_name} className="w-full h-full object-cover" />
                 </div>
              )}
              <CardHeader className={cn("pb-3 flex-none", bay.primary_image ? "pt-4" : "")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {bay.category?.toLowerCase().includes("cowboy") ? (
                        <Crosshair className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Target className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{bay.bay_name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground font-medium">{bay.category || "Uncategorized"}</p>
                    </div>
                  </div>
                  <Badge variant={bay.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">
                    {bay.status || "Active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 bg-muted/30 p-3 rounded-lg border">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground">
                        <DollarSign className="h-3 w-3" /> Base
                      </span>
                      <p className="text-sm font-bold">${bay.base_price || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground">
                        <Clock className="h-3 w-3" /> Same Day
                      </span>
                      <p className="text-sm font-bold">${bay.same_day_price || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground">
                        <ListOrdered className="h-3 w-3" /> Min. Fee
                      </span>
                      <p className="text-sm font-medium text-muted-foreground">${bay.minimum_booking_fee || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 justify-end pt-2 mt-auto border-t border-border/50">
                  <Button variant="outline" size="sm" className="h-8 text-xs px-2 shadow-none" onClick={() => { 
                    setEditBay({
                      id: bay.id,
                      bay_name: bay.bay_name,
                      category: bay.category,
                      description: bay.description,
                      primary_image: bay.primary_image,
                      layout_image: bay.layout_image,
                      rules: bay.rules,
                      base_price: bay.base_price,
                      same_day_price: bay.same_day_price,
                      minimum_booking_fee: bay.minimum_booking_fee,
                      per_person_rate: bay.per_person_rate,
                      status: bay.status,
                    });
                    setFormOpen(true);
                  }}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive shadow-none hover:text-destructive hover:bg-destructive/10 border-transparent" onClick={() => setDeleteId(bay.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
