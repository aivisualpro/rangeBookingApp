"use client";

import React from "react";
import { type Table } from "@tanstack/react-table";
import { Download, X, Filter } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dashboardpack/core/components/ui/popover";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { HeaderActionsPortal } from "../../dashboard/header-portal";

interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options?: { label: string; value: string }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilterConfig[];
  bulkActions?: (selectedRows: TData[]) => React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  facetedFilters,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const selectedCount = Object.keys(table.getState().rowSelection).length;
  const activeFilterCount = table.getState().columnFilters.length;
  const isFiltered = activeFilterCount > 0;


  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {selectedCount > 0 && bulkActions && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            {bulkActions(
              table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original)
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              <X className="me-1 size-3.5" />
              Clear
            </Button>
          </div>
        )}
      </div>

      <HeaderActionsPortal>
        {facetedFilters && facetedFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-9 shrink-0 relative">
                <Filter className="size-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Filters</h4>
                {isFiltered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => table.resetColumnFilters()}
                  >
                    Reset all
                    <X className="ms-1 size-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {facetedFilters.map((filter) => {
                  const column = table.getColumn(filter.columnId);
                  if (!column) return null;
                  return (
                    <div key={filter.columnId}>
                      <DataTableFacetedFilter
                        column={column}
                        title={filter.title}
                        options={filter.options}
                      />
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </HeaderActionsPortal>
    </div>
  );
}
