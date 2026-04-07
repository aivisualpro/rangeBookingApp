import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header with Mark all as read button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>

      {/* Notifications card */}
      <div className="rounded-xl border border-border bg-card">
        {/* Card header: title + badge + filter tabs */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>

        {/* Notification items */}
        <div className="px-5 pb-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-lg px-3 py-4">
              {/* Icon */}
              <Skeleton className="mt-0.5 h-9 w-9 shrink-0 rounded-lg" />
              {/* Content */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48" />
                  {i % 3 === 0 && <Skeleton className="h-2 w-2 rounded-full" />}
                </div>
                <Skeleton className="h-3 w-72" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
