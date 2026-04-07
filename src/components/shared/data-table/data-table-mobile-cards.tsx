"use client";

import { type Table, flexRender } from "@tanstack/react-table";
import { cn } from "@dashboardpack/core/lib/utils";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";

interface DataTableMobileCardsProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
}

export function DataTableMobileCards<TData>({
  table,
  onRowClick,
  emptyMessage = "No results found.",
}: DataTableMobileCardsProps<TData>) {
  const rows = table.getRowModel().rows;

  // Get visible columns excluding actions and select, respecting mobileHidden
  const visibleColumns = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.getIsVisible() &&
        col.id !== "select" &&
        col.id !== "actions" &&
        !col.columnDef.meta?.mobileHidden
    );

  const actionsColumn = table.getAllLeafColumns().find((col) => col.id === "actions");

  return (
    <div className="md:hidden space-y-3">
      {rows.length > 0 ? (
        rows.map((row) => {
          const cells = row.getVisibleCells();
          const cardColumns = visibleColumns;
          const firstCol = cardColumns[0];
          const restCols = cardColumns.slice(1);

          // Find the corresponding cell for each column
          const getCellForColumn = (colId: string) =>
            cells.find((cell) => cell.column.id === colId);

          const actionsCell = actionsColumn
            ? getCellForColumn(actionsColumn.id)
            : undefined;

          return (
            <div
              key={row.id}
              className={cn(
                "rounded-lg border bg-card p-4 space-y-3",
                onRowClick && "cursor-pointer active:bg-muted/50"
              )}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            >
              {/* First column as card header */}
              {firstCol && (
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {(() => {
                      const cell = getCellForColumn(firstCol.id);
                      return cell
                        ? flexRender(cell.column.columnDef.cell, cell.getContext())
                        : null;
                    })()}
                  </div>
                  {actionsCell && (
                    <div onClick={(e) => e.stopPropagation()}>
                      {flexRender(
                        actionsCell.column.columnDef.cell,
                        actionsCell.getContext()
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Remaining columns as label-value pairs */}
              {restCols.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {restCols.map((col) => {
                    const cell = getCellForColumn(col.id);
                    if (!cell) return null;

                    const headerDef = col.columnDef.header;
                    const label =
                      col.columnDef.meta?.mobileLabel ??
                      (typeof headerDef === "string" ? headerDef : col.id);

                    return (
                      <div key={col.id}>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <div className="mt-0.5 font-medium">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <EmptyState title={emptyMessage} />
      )}
    </div>
  );
}
