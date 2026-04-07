import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header with period toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-48 rounded-lg" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row: line chart + bar chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-3 w-52 mb-4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
        <div className="xl:col-span-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-3 w-52 mb-4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Bottom row: top pages + top countries */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Top Pages table */}
        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-5 w-28 mb-1" />
          <Skeleton className="h-3 w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-44" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries with progress bars */}
        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-52 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
