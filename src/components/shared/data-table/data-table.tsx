"use client";

import React, { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dashboardpack/core/components/ui/table";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableMobileCards } from "./data-table-mobile-cards";

import "./types";

interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options?: { label: string; value: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  onRowClick?: (row: TData) => void;
  perPageOptions?: number[];
  emptyMessage?: string;
  bulkActions?: (selectedRows: TData[]) => React.ReactNode;
  facetedFilters?: FacetedFilterConfig[];
  initialColumnVisibility?: VisibilityState;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  enableRowSelection = false,
  onRowClick,
  perPageOptions,
  emptyMessage = "No results found.",
  bulkActions,
  facetedFilters,
  initialColumnVisibility,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility ?? {}
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: perPageOptions?.[0] ?? 20,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar (portaled, takes no height) */}
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        facetedFilters={facetedFilters}
        bulkActions={bulkActions}
      />

      {/* Desktop Table */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 rounded-md border bg-background overflow-hidden relative">
        <Table className="[&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-background/95 [&_th]:backdrop-blur [&_th]:shadow-[inset_0_-1px_0_hsl(var(--border))]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((_, j) => (
                      <TableCell key={`skeleton-${i}-${j}`}>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={
                      onRowClick ? () => onRowClick(row.original) : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24"
                  >
                    <EmptyState title={emptyMessage} className="py-0" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>

      {/* Mobile Card View */}
      <DataTableMobileCards
        table={table}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
      />

      {/* Pagination — always at bottom */}
      <div className="shrink-0 border-t pt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
