"use client";

import { useMemo } from "react";
import { type Table } from "@tanstack/react-table";
import { Button } from "@dashboardpack/core/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

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
    <div className="flex items-center justify-between py-2">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1}-{endIndex} of {totalItems} results
      </div>

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
  );
}
