"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@dashboardpack/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  X,
  Target,
  Crosshair,
  DollarSign,
  ListOrdered,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import {
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent,
  type CalendarEvent,
  type EventColor,
} from "@dashboardpack/core/lib/data/calendar";
import { HeaderActionsPortal } from "@/components/dashboard/header-portal";
import { BayCard } from "@/components/dashboard/bay-card";

// ── Calendar helpers ────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${suffix}`;
}

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month fill
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const days: CalendarDay[] = [];

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateKey = formatDateKey(prevYear, prevMonth, day);
    days.push({
      day,
      month: prevMonth,
      year: prevYear,
      dateKey,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    days.push({
      day,
      month,
      year,
      dateKey,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
    });
  }

  // Trailing days from next month (fill to 42 cells = 6 rows)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    const dateKey = formatDateKey(nextYear, nextMonth, day);
    days.push({
      day,
      month: nextMonth,
      year: nextYear,
      dateKey,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
    });
  }

  return days;
}

// ── Color mapping ───────────────────────────────────────────────────────

const EVENT_COLOR_CLASSES: Record<EventColor, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const EVENT_PILL_CLASSES: Record<EventColor, string> = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

const COLOR_LABELS: { value: EventColor; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "destructive", label: "Destructive" },
];

// ── Page component ──────────────────────────────────────────────────────

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1); // February = 1
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formColor, setFormColor] = useState<EventColor>("primary");
  const [formDescription, setFormDescription] = useState("");
  const [formBay, setFormBay] = useState<string>("");
  const [allowedBays, setAllowedBays] = useState<any[]>([]);

  // Fetch allowed bays
  useEffect(() => {
    fetch("/api/bays/allowed")
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => setAllowedBays(json.data || []))
      .catch(() => {});
  }, []);

  // Fetch bookings dynamically
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.data) {
        const mappedEvents: CalendarEvent[] = json.data.map((b: any) => ({
          id: b.id,
          title: b.customer_notes?.split("\n")[0] || b.bay_name_snapshot,
          date: b.booking_date,
          time: b.start_time,
          endTime: b.end_time,
          color: b.status === "Approved" ? "success" : b.status === "Pending" ? "warning" : "primary",
          description: `Company: ${b.company_name_snapshot}\nRef: ${b.reference_id}${b.customer_notes ? `\n\nNotes: ${b.customer_notes}` : ""}`
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Build grid
  const calendarDays = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Index events by date for quick lookup
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) {
        map[event.date] = [];
      }
      map[event.date].push(event);
    }
    // Sort each day's events by time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
    }
    return map;
  }, [events]);

  const selectedDateEvents = useMemo(
    () => (selectedDate ? eventsByDate[selectedDate] ?? [] : []),
    [selectedDate, eventsByDate]
  );

  // Navigation
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
    setSelectedDate(null);
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
    setSelectedDate(null);
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(
      formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
    );
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormTitle("");
    setFormDate("");
    setFormTime("");
    setFormEndTime("");
    setFormColor("primary");
    setFormDescription("");
    setFormBay("");
  }, []);

  // Add event handler
  const handleAddEvent = useCallback(async () => {
    if (!formTitle.trim() || !formDate || !formBay) return;

    try {
      const payload = {
        bay_id: formBay,
        booking_date: formDate,
        start_time: formTime,
        end_time: formEndTime,
        customer_notes: `${formTitle.trim()}\n${formDescription.trim()}`
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create booking");
      }

      await fetchBookings();
      setAddDialogOpen(false);
      resetForm();
      toast.success(`Booking created successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking");
    }
  }, [formTitle, formDate, formTime, formEndTime, formDescription, formBay, fetchBookings, resetForm]);

  // Delete event handler
  const handleDeleteEvent = useCallback(
    async (event: CalendarEvent) => {
      try {
        const res = await fetch(`/api/bookings/${event.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete booking");

        await fetchBookings();
        toast.success(`Booking deleted`);
      } catch (err: any) {
        toast.error("An error occurred");
      }
    },
    [fetchBookings]
  );

  // Open add dialog with pre-filled date
  const openAddDialog = useCallback(
    (date?: string) => {
      resetForm();
      if (date) {
        setFormDate(date);
      }
      setAddDialogOpen(true);
    },
    [resetForm]
  );

  // Handle day click
  const handleDayClick = useCallback((dateKey: string) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }, []);

  // Format selected date for display
  const selectedDateDisplay = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  return (
    <>
      <HeaderActionsPortal>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openAddDialog()} size="sm" className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              Create Booking
            </Button>
          </DialogTrigger>
          <AddEventDialog
            formTitle={formTitle}
            setFormTitle={setFormTitle}
            formDate={formDate}
            setFormDate={setFormDate}
            formTime={formTime}
            setFormTime={setFormTime}
            formEndTime={formEndTime}
            setFormEndTime={setFormEndTime}
            formColor={formColor}
            setFormColor={setFormColor}
            formDescription={formDescription}
            setFormDescription={setFormDescription}
            formBay={formBay}
            setFormBay={setFormBay}
            allowedBays={allowedBays}
            onSubmit={handleAddEvent}
          />
        </Dialog>
      </HeaderActionsPortal>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Calendar grid */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Month navigation */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="ms-2 text-lg font-semibold">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((calDay) => {
                const dayEvents = eventsByDate[calDay.dateKey] ?? [];
                const isSelected = selectedDate === calDay.dateKey;
                return (
                  <button
                    key={calDay.dateKey}
                    type="button"
                    onClick={() => handleDayClick(calDay.dateKey)}
                    className={cn(
                      "relative flex min-h-[80px] flex-col items-start border-b border-e border-border p-1.5 text-start transition-colors hover:bg-muted/50 sm:min-h-[100px] sm:p-2",
                      // First column gets left border
                      calDay.dateKey === calendarDays[0].dateKey && "border-s",
                      // Start of each row gets left border
                      calendarDays.indexOf(calDay) % 7 === 0 && "border-s",
                      !calDay.isCurrentMonth && "bg-muted/30",
                      isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/30"
                    )}
                    aria-label={`${calDay.day} ${MONTH_NAMES[calDay.month]} ${calDay.year}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
                        calDay.isToday &&
                          "bg-primary text-primary-foreground font-semibold",
                        !calDay.isToday &&
                          !calDay.isCurrentMonth &&
                          "text-muted-foreground",
                        !calDay.isToday &&
                          calDay.isCurrentMonth &&
                          "text-foreground"
                      )}
                    >
                      {calDay.day}
                    </span>
                    {/* Event indicators */}
                    <div className="mt-0.5 flex w-full flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight sm:text-xs",
                            EVENT_PILL_CLASSES[event.color]
                          )}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="px-1 text-[10px] font-medium text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Side panel — selected day events */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              {selectedDate ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {selectedDateDisplay}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {selectedDateEvents.length === 0
                          ? "No events scheduled"
                          : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddDialog(selectedDate)}
                      >
                        <Plus className="me-1 h-3.5 w-3.5" />
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedDate(null)}
                        aria-label="Close panel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedDateEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No events for this day
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-1"
                        onClick={() => openAddDialog(selectedDate)}
                      >
                        Create one
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="group relative rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-1 h-2 w-2 shrink-0 rounded-full",
                                EVENT_COLOR_CLASSES[event.color]
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-tight">
                                {event.title}
                              </p>
                              {event.time && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(event.time)}
                                  {event.endTime &&
                                    ` – ${formatTime(event.endTime)}`}
                                </p>
                              )}
                              {event.description && (
                                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                              <Badge
                                variant={event.color === "primary" ? "default" : event.color}
                                className="mt-2"
                              >
                                {event.color}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => handleDeleteEvent(event)}
                              aria-label={`Delete ${event.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No date selected</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click a day on the calendar to view its events
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardContent className="p-4 sm:p-5">
              <h3 className="mb-3 text-sm font-semibold">Upcoming Events</h3>
              <UpcomingEvents events={events} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// ── Add Event Dialog Content ────────────────────────────────────────────

interface AddEventDialogProps {
  formTitle: string;
  setFormTitle: (v: string) => void;
  formDate: string;
  setFormDate: (v: string) => void;
  formTime: string;
  setFormTime: (v: string) => void;
  formEndTime: string;
  setFormEndTime: (v: string) => void;
  formColor: EventColor;
  setFormColor: (v: EventColor) => void;
  formDescription: string;
  setFormDescription: (v: string) => void;
  formBay: string;
  setFormBay: (v: string) => void;
  allowedBays: any[];
  onSubmit: () => void;
}

function AddEventDialog({
  formTitle,
  setFormTitle,
  formDate,
  setFormDate,
  formTime,
  setFormTime,
  formEndTime,
  setFormEndTime,
  formColor,
  setFormColor,
  formDescription,
  setFormDescription,
  formBay,
  setFormBay,
  allowedBays,
  onSubmit,
}: AddEventDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const isStep1Valid = formBay.length > 0;
  const isStep2Valid = formTitle.trim().length > 0 && formDate.length > 0;
  const isValid = isStep1Valid && isStep2Valid;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  return (
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{step === 1 ? "Select a Bay" : "Booking Details"}</DialogTitle>
        <DialogDescription>
          {step === 1 
            ? "Choose from your company's authorized range facilities."
            : "Set the dates and final details for your reservation."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {step === 1 ? (
          <div className="space-y-4">
            {allowedBays.length === 0 ? (
               <div className="p-8 text-center border rounded-xl border-dashed bg-muted/20">
                 <p className="text-sm text-foreground font-medium">No Bays Authorized</p>
                 <p className="text-xs text-muted-foreground mt-1">Your company has not been assigned any active bays yet.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[500px] overflow-y-auto pr-2 pb-2">
                 {allowedBays.map(bay => (
                   <BayCard 
                     key={bay.id} 
                     bay={bay} 
                     mode="select"
                     isSelected={formBay === bay.id}
                     onSelect={(b) => setFormBay(b.id)}
                   />
                 ))}
               </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button type="button" onClick={handleNext} disabled={!isStep1Valid}>
                Continue Details →
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="event-title">
                Booking Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-title"
                placeholder="e.g. Instructor Certification"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="event-date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>

            {/* Time row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-time">Start Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-end-time">End Time</Label>
                <Input
                  id="event-end-time"
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Color */}
            <div className="grid gap-2">
              <Label htmlFor="event-color">Event Color Tag</Label>
              <Select
                value={formColor}
                onValueChange={(v) => setFormColor(v as EventColor)}
              >
                <SelectTrigger className="w-full" id="event-color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_LABELS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-block h-2.5 w-2.5 rounded-full",
                            EVENT_COLOR_CLASSES[c.value]
                          )}
                        />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Optional notes constraints or instructions"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <DialogFooter className="pt-4 border-t flex items-center justify-between mt-2">
               <Button type="button" variant="outline" onClick={handleBack}>
                 ← Back
               </Button>
               <Button onClick={() => { onSubmit(); setStep(1); }} disabled={!isValid}>
                 Book Now
               </Button>
            </DialogFooter>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

// ── Upcoming Events ─────────────────────────────────────────────────────

function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  const today = formatDateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => e.date >= today)
        .sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return (a.time ?? "").localeCompare(b.time ?? "");
        })
        .slice(0, 5),
    [events, today]
  );

  if (upcoming.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        No upcoming events
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {upcoming.map((event) => {
        const [y, m, d] = event.date.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div key={event.id} className="flex items-center gap-3">
            <div
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                EVENT_COLOR_CLASSES[event.color]
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{event.title}</p>
              <p className="text-[10px] text-muted-foreground">
                {label}
                {event.time && ` at ${formatTime(event.time)}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
