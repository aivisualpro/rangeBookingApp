import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function SupportLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-68" />
      </div>

      {/* Status + Quick Links row (3 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* FAQ card */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 space-y-1">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="px-5 pb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/50 last:border-0 py-4">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form card */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 space-y-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="px-5 pb-5 space-y-4">
            {/* Name + Email (2-col) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
            {/* Subject */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            {/* Message textarea */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-[120px] w-full rounded-md" />
            </div>
            {/* Submit button */}
            <div className="flex justify-end">
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
