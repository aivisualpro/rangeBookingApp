import React from "react";
import { Crosshair, Target, DollarSign, Clock, ListOrdered, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
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

  return (
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
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <Badge variant={bay.status === 'Active' ? 'success' : 'secondary'} className={cn("shadow-sm font-semibold tracking-wide backdrop-blur-md border-transparent", bay.status === 'Active' ? "bg-success/90 text-success-foreground" : "bg-background/80 text-foreground")}>
            {bay.status || "Active"}
          </Badge>
        </div>

        {/* Bottom Header Info */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col z-10">
          <h3 className={cn("font-bold text-white leading-tight drop-shadow-md mb-1.5", isSelectMode ? "text-lg" : "text-xl")}>{bay.bay_name}</h3>
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

      <CardContent className={cn("flex flex-1 flex-col bg-card", isSelectMode ? "p-3" : "p-5")}>
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

        {/* Actions Footer (Only Admin Mode) */}
        {!isSelectMode && (
          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/50">
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
  );
}
