import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      {/* Page header with Add Event button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Calendar grid card */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="ms-2 h-6 w-40" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-border pb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>

          {/* Calendar cells (6 rows x 7 cols) */}
          <div className="grid grid-cols-7">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="min-h-[80px] border-b border-e border-border p-1.5 sm:min-h-[100px] sm:p-2">
                <Skeleton className="h-6 w-6 rounded-full sm:h-7 sm:w-7" />
                {/* Some cells show event pills */}
                {(i === 5 || i === 12 || i === 18 || i === 24 || i === 30) && (
                  <Skeleton className="mt-1 h-4 w-full rounded" />
                )}
                {(i === 12 || i === 24) && (
                  <Skeleton className="mt-0.5 h-4 w-4/5 rounded" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Selected day events */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Skeleton className="mb-3 h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-56" />
            </div>
          </div>

          {/* Upcoming events */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <Skeleton className="mb-3 h-4 w-32" />
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
