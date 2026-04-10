"use client";

import React, { useState } from "react";
import { Crosshair, Target, DollarSign, Clock, ListOrdered, Pencil, Trash2, CheckCircle2, Map } from "lucide-react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@dashboardpack/core/components/ui/dialog";
import { cn } from "@dashboardpack/core/lib/utils";

export interface BayData {
  id: string;
  bay_name: string;
  category: string;
  description?: string;
  primary_image?: string;
  layout_image?: string;
  rules?: string;
  base_price: number;
  same_day_price: number;
  minimum_booking_fee: number;
  per_person_rate?: number;
  status: string;
}

interface BayCardProps {
  bay: BayData;
  mode?: "admin" | "select";
  isSelected?: boolean;
  onSelect?: (bay: BayData) => void;
  onEdit?: (bay: BayData) => void;
  onDelete?: (id: string) => void;
}

export function BayCard({ bay, mode = "admin", isSelected, onSelect, onEdit, onDelete }: BayCardProps) {
  const isSelectMode = mode === "select";
  const [descOpen, setDescOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);

  return (
    <>
      <Dialog open={descOpen} onOpenChange={setDescOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{bay.bay_name}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Bay Description</h4>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap p-4 bg-muted/40 rounded-xl border border-border/50">
              {bay.description || "No description provided."}
            </div>
            
            {bay.rules && (
              <>
                <h4 className="text-sm font-semibold mt-4 mb-2 text-muted-foreground">Rules & Requirements</h4>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap p-4 bg-muted/40 rounded-xl border border-border/50">
                  {bay.rules}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={layoutOpen} onOpenChange={setLayoutOpen}>
        <DialogContent className="sm:max-w-[700px] border-none bg-transparent p-0 rounded-2xl overflow-hidden shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{bay.bay_name} Layout Diagram</DialogTitle>
          </DialogHeader>
          <div className="relative bg-black/90 p-1 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bay.layout_image} alt={`${bay.bay_name} Layout Diagram`} className="max-h-[85vh] w-auto object-contain rounded-xl" />
          </div>
        </DialogContent>
      </Dialog>

      <Card 
        onClick={() => isSelectMode && onSelect?.(bay)}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 flex flex-col border-border/60 rounded-2xl",
          isSelectMode && "cursor-pointer hover:border-primary/50",
          isSelected && "border-primary shadow-md ring-2 ring-primary/20",
          !isSelectMode && "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
        )}
      >
        {/* Select Mode Checkmark */}
        {isSelectMode && isSelected && (
          <div className="absolute top-3 left-3 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-in zoom-in-50">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}

        <div className={cn("relative w-full shrink-0 overflow-hidden bg-muted", isSelectMode ? "h-32" : "h-48")}>
          {bay.primary_image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
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
          {!isSelectMode && (
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <Badge variant={bay.status === 'Active' ? 'success' : 'secondary'} className={cn("shadow-sm font-semibold tracking-wide backdrop-blur-md border-transparent", bay.status === 'Active' ? "bg-success/90 text-success-foreground" : "bg-background/80 text-foreground")}>
                {bay.status || "Active"}
              </Badge>
            </div>
          )}

          {/* Bottom Header Info */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-row items-center justify-between z-10 gap-2">
            <h3 className={cn("font-bold text-white leading-tight drop-shadow-md truncate", isSelectMode ? "text-xl" : "text-2xl")}>{bay.bay_name}</h3>
            
            {/* Category Chip */}
            <div className={cn(
              "inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md",
              bay.category?.toLowerCase().includes("cowboy") 
                ? "bg-amber-500/90 text-white border border-amber-400/30" 
                : bay.category?.toLowerCase().includes("pistol")
                ? "bg-blue-500/90 text-white border border-blue-400/30"
                : bay.category?.toLowerCase().includes("rifle")
                ? "bg-emerald-500/90 text-white border border-emerald-400/30"
                : bay.category?.toLowerCase().includes("tactical")
                ? "bg-rose-500/90 text-white border border-rose-400/30"
                : "bg-slate-600/90 text-white border border-slate-400/30"
            )}>
              {bay.category?.toLowerCase().includes("cowboy") ? (
                <Crosshair className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              ) : (
                <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              )}
              {bay.category || "Uncategorized"}
            </div>
          </div>
        </div>

        <CardContent className={cn("flex flex-1 flex-col bg-card", isSelectMode ? "p-3" : "p-5")}>
          {/* Description Block */}
          {bay.description && (
            <div className="mb-4 flex flex-col items-start space-y-1 w-full">
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed w-full">
                {bay.description}
              </p>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setDescOpen(true); }}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/70 transition-colors"
              >
                Read more ...
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 py-1 mb-auto">
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Base</span>
              <span className={cn("font-black text-foreground", isSelectMode ? "text-sm" : "text-[15px]")}>${bay.base_price || 0}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Same Day</span>
              <span className={cn("font-black text-foreground", isSelectMode ? "text-sm" : "text-[15px]")}>${bay.same_day_price || 0}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-2.5 text-center transition-colors group-hover:bg-primary/5 border border-transparent group-hover:border-primary/10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Min Fee</span>
              <span className={cn("font-bold text-muted-foreground", isSelectMode ? "text-sm" : "text-[15px]")}>${bay.minimum_booking_fee || 0}</span>
            </div>
          </div>

          {/* Layout Diagram (Select Mode) */}
          {isSelectMode && bay.layout_image && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                className="w-full h-8 text-[11px] font-bold uppercase tracking-wider border-border/60 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); setLayoutOpen(true); }}
              >
                <Map className="h-3 w-3 mr-2 text-muted-foreground" /> Layout Diagram
              </Button>
            </div>
          )}

          {/* Actions Footer (Only Admin Mode) */}
          {!isSelectMode && (
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/50">
              {bay.layout_image && (
                <Button 
                  variant="outline"
                  className="rounded-xl shadow-none h-10 border-border/60 font-semibold text-muted-foreground hover:bg-muted"
                  onClick={(e) => { e.stopPropagation(); setLayoutOpen(true); }}
                >
                  <Map className="h-4 w-4" />
                </Button>
              )}
              <Button 
                className="flex-1 rounded-xl shadow-none h-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold transition-all" 
                onClick={(e) => { 
                  e.stopPropagation();
                  onEdit?.(bay);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit Bay
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 shrink-0 rounded-xl border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all shadow-none" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(bay.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
