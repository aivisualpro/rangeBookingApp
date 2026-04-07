import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Tabs navigation */}
      <Skeleton className="h-9 w-80 rounded-lg" />

      {/* Profile tab content (default tab) */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 space-y-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-52" />
        </div>
        <div className="px-5 pb-5 space-y-6">
          {/* Avatar row */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Name fields (2-col) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          {/* Bio field (textarea) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-[100px] w-full rounded-md" />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
