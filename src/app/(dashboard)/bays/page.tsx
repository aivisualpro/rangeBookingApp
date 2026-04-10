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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBays.map((bay) => (
            <Card key={bay.id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col border-border/60 rounded-2xl">
              <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted">
                {bay.primary_image ? (
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bay.primary_image} alt={bay.bay_name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110">
                    {bay.category?.toLowerCase().includes("cowboy") ? (
                      <Crosshair className="h-16 w-16 text-muted-foreground/15" />
                    ) : (
                      <Target className="h-16 w-16 text-muted-foreground/15" />
                    )}
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Top actions/badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge variant={bay.status === 'Active' ? 'success' : 'secondary'} className={cn("shadow-sm font-semibold tracking-wide backdrop-blur-md border-transparent", bay.status === 'Active' ? "bg-success/90 text-success-foreground" : "bg-background/80 text-foreground")}>
                    {bay.status || "Active"}
                  </Badge>
                </div>

                {/* Bottom Header Info */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                  <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md mb-1.5">{bay.bay_name}</h3>
                  <div className="flex items-center gap-1.5 opacity-90">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                      {bay.category?.toLowerCase().includes("cowboy") ? (
                        <Crosshair className="h-3 w-3 text-amber-300" />
                      ) : (
                        <Target className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-semibold tracking-wide uppercase text-white/90 drop-shadow-sm">{bay.category || "Uncategorized"}</span>
                  </div>
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col p-5 bg-card">
                <div className="grid grid-cols-3 gap-2 py-1 mb-auto">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Base</span>
                    <span className="text-[15px] font-black text-foreground">${bay.base_price || 0}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Same Day</span>
                    <span className="text-[15px] font-black text-foreground">${bay.same_day_price || 0}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Min Fee</span>
                    <span className="text-[15px] font-bold text-muted-foreground">${bay.minimum_booking_fee || 0}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/50">
                  <Button 
                    className="flex-1 rounded-xl shadow-none h-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold transition-all" 
                    onClick={() => { 
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
                    <Pencil className="h-4 w-4 mr-2" /> Edit Bay
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all shadow-none" onClick={() => setDeleteId(bay.id)}>
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
