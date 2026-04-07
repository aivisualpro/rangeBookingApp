import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Current Plan card */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-10 w-24" />
          <div className="mt-6 space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>
        </div>

        {/* Payment Method + Usage card */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-full rounded-md" />

          {/* Usage section */}
          <Skeleton className="h-5 w-14" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing History table */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="space-y-1 mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="space-y-0">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b border-border pb-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ms-auto h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border/50 last:border-0 py-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="ms-auto h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
