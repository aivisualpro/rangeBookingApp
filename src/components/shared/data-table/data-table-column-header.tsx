"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 hover:text-foreground -ms-2 px-2 py-1 rounded-md transition-colors",
        className
      )}
      onClick={() => {
        // Cycle: none → asc → desc → none
        const current = column.getIsSorted();
        if (current === false) {
          column.toggleSorting(false); // asc
        } else if (current === "asc") {
          column.toggleSorting(true); // desc
        } else {
          column.clearSorting(); // none
        }
      }}
    >
      {title}
      <span className="text-muted-foreground">
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </span>
    </button>
  );
}
