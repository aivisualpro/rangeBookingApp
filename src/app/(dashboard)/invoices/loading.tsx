import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Invoices card with search + filter + table */}
      <div className="rounded-xl border border-border bg-card">
        {/* Card header: title + search + filter tabs */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-5 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-60 rounded-md" />
            <Skeleton className="h-9 w-52 rounded-lg" />
          </div>
        </div>

        {/* Table */}
        <div className="px-5 pb-5">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b border-border pb-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="ms-auto h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border/50 last:border-0 py-3">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ms-auto h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}

          {/* Footer count */}
          <Skeleton className="mt-4 h-3 w-40" />
        </div>
      </div>
    </div>
  );
}
