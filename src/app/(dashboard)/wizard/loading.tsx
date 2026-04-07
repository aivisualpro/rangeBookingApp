import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function WizardLoading() {
  return (
    <div className="mx-auto max-w-3xl py-8 px-4 space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Step indicator card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-center w-full px-4 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <Skeleton className="h-0.5 w-16 mx-2" />}
              <div className="flex flex-col items-center gap-2 min-w-[80px]">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-border bg-card">
        {/* Card header */}
        <div className="p-6 pb-2 space-y-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Form fields */}
        <div className="p-6 space-y-5">
          {/* Field 1: Project Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          {/* Field 2: Description (textarea) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-[120px] w-full rounded-md" />
          </div>

          {/* Field 3: Category (select) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between p-6 pt-2">
          <div />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
