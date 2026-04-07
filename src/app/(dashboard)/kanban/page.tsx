"use client";

import React, { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Calendar,
  Trash2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@dashboardpack/core/lib/utils";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Card } from "@dashboardpack/core/components/ui/card";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dashboardpack/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";

import {
  getKanbanColumns,
  moveTask,
  addTask,
  deleteTask,
  type KanbanColumn,
  type KanbanTask,
  type KanbanPriority,
} from "@dashboardpack/core/lib/data/kanban";

// ---------------------------------------------------------------------------
// Priority helpers
// ---------------------------------------------------------------------------

const priorityVariant: Record<KanbanPriority, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

const priorityLabel: Record<KanbanPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// ---------------------------------------------------------------------------
// Label colour palette (deterministic by index)
// ---------------------------------------------------------------------------

const labelColors = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
];

function labelColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return labelColors[Math.abs(hash) % labelColors.length];
}

// ---------------------------------------------------------------------------
// New-task form state
// ---------------------------------------------------------------------------

interface NewTaskForm {
  title: string;
  description: string;
  priority: KanbanPriority;
  assignee: string;
  dueDate: string;
  columnId: string;
}

const emptyForm: NewTaskForm = {
  title: "",
  description: "",
  priority: "medium",
  assignee: "",
  dueDate: "",
  columnId: "backlog",
};

function initialsFrom(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function KanbanPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(getKanbanColumns);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewTaskForm>(emptyForm);

  // -- Refresh from the module-level store ----------------------------------
  const refresh = useCallback(() => setColumns(getKanbanColumns()), []);

  // -- Drag & drop handler --------------------------------------------------
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index,
      );
      refresh();
    },
    [refresh],
  );

  // -- Add task -------------------------------------------------------------
  const handleAddTask = useCallback(() => {
    if (!form.title.trim()) return;

    addTask(form.columnId, {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      assignee: form.assignee.trim() || undefined,
      assigneeInitials: form.assignee.trim()
        ? initialsFrom(form.assignee.trim())
        : undefined,
      dueDate: form.dueDate || undefined,
    });

    toast.success("Task created successfully");
    setForm(emptyForm);
    setDialogOpen(false);
    refresh();
  }, [form, refresh]);

  // -- Delete task ----------------------------------------------------------
  const handleDeleteTask = useCallback(
    (columnId: string, taskId: string) => {
      deleteTask(columnId, taskId);
      toast.success("Task deleted");
      refresh();
    },
    [refresh],
  );

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-end mb-6"></div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {columns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      {/* New task dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the board. Only the title is required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="task-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g. Build user settings page"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea
                id="task-desc"
                placeholder="Optional details..."
                className="min-h-[80px]"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Priority + Column row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(val) =>
                    setForm((f) => ({
                      ...f,
                      priority: val as KanbanPriority,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Column</Label>
                <Select
                  value={form.columnId}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, columnId: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee */}
            <div className="grid gap-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input
                id="task-assignee"
                placeholder="e.g. Jane Doe"
                value={form.assignee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignee: e.target.value }))
                }
              />
            </div>

            {/* Due date */}
            <div className="grid gap-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={!form.title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Column component
// ---------------------------------------------------------------------------

function KanbanColumnComponent({
  column,
  onDelete,
}: {
  column: KanbanColumn;
  onDelete: (columnId: string, taskId: string) => void;
}) {
  return (
    <div className="flex w-[320px] min-w-[320px] flex-col rounded-xl bg-muted/50 p-3">
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-foreground">
          {column.title}
        </h3>
        <Badge variant="secondary" className="text-[11px] tabular-nums">
          {column.tasks.length}
        </Badge>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex min-h-[120px] flex-1 flex-col gap-2 rounded-lg p-1 transition-colors",
              snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20",
            )}
          >
            {column.tasks.map((task, index) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task card component
// ---------------------------------------------------------------------------

function KanbanTaskCard({
  task,
  index,
  columnId,
  onDelete,
}: {
  task: KanbanTask;
  index: number;
  columnId: string;
  onDelete: (columnId: string, taskId: string) => void;
}) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group relative cursor-grab p-3 hover:shadow-md active:cursor-grabbing",
            snapshot.isDragging && "rotate-2 shadow-lg",
          )}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className="absolute top-3 ltr:right-2 rtl:left-2 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className={cn(
                    "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                    labelColor(label),
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <p className="pe-6 text-sm font-medium leading-snug text-foreground">
            {task.title}
          </p>

          {/* Description (truncated) */}
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}

          {/* Footer row: priority, due date, assignee, delete */}
          <div className="mt-3 flex items-center gap-2">
            <Badge
              variant={priorityVariant[task.priority]}
              className="text-[10px] px-1.5 py-0"
            >
              {priorityLabel[task.priority]}
            </Badge>

            {task.dueDate && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </span>
            )}

            <span className="flex-1" />

            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, task.id);
              }}
              className="rounded p-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {/* Assignee avatar */}
            {task.assigneeInitials && (
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                title={task.assignee}
              >
                {task.assigneeInitials}
              </div>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
}
