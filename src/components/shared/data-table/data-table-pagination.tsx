"use client";

import { useMemo } from "react";
import { type Table } from "@tanstack/react-table";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  perPageOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  perPageOptions = [10, 20, 50],
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1; // TanStack is 0-indexed
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const selectedCount = Object.keys(table.getState().rowSelection).length;

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {selectedCount > 0 && (
          <span>
            {selectedCount} of {totalItems} row(s) selected
          </span>
        )}
        {selectedCount > 0 && <span className="text-border">|</span>}
        <span>
          Showing {startIndex + 1}-{endIndex} of {totalItems} results
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Per-page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <span className="hidden sm:contents">
            {pageNumbers.map((page, i) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className="min-w-8"
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              )
            )}
          </span>
          <span className="sm:hidden text-sm text-muted-foreground px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
