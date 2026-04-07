import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function KanbanLoading() {
  return (
    <div className="space-y-6">
      {/* Page header with breadcrumbs + New Task button */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {Array.from({ length: 4 }).map((_, colIdx) => (
          <div key={colIdx} className="flex w-[320px] min-w-[320px] flex-col rounded-xl bg-muted/50 p-3">
            {/* Column header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2 p-1">
              {Array.from({ length: colIdx === 0 ? 3 : colIdx === 1 ? 4 : colIdx === 2 ? 2 : 1 }).map((_, taskIdx) => (
                <div key={taskIdx} className="rounded-xl border border-border bg-card p-3 space-y-2">
                  {/* Labels */}
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-14 rounded" />
                    {taskIdx % 2 === 0 && <Skeleton className="h-4 w-12 rounded" />}
                  </div>
                  {/* Title */}
                  <Skeleton className="h-4 w-full" />
                  {/* Description */}
                  {taskIdx % 3 !== 2 && <Skeleton className="h-3 w-4/5" />}
                  {/* Footer: priority, date, assignee */}
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-4 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                    <span className="flex-1" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
