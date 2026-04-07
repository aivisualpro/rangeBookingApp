"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Check,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Pencil,
  FolderPlus,
  Users,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { cn } from "@dashboardpack/core/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              Zod Schemas                                   */
/* -------------------------------------------------------------------------- */

const step1Schema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters"),
  projectDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.enum(
    ["SaaS", "E-commerce", "Marketing", "Internal Tool", "Other"],
    { message: "Please select a category" }
  ),
});

const step2Schema = z.object({
  teamSize: z.enum(["Solo", "2-5", "6-15", "16-50", "50+"], {
    message: "Please select a team size",
  }),
  teamName: z.string().min(1, "Team name is required"),
  invitedMembers: z.array(z.string().email()),
});

const step3Schema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  defaultView: z.enum(["Dashboard", "Kanban", "Calendar", "List"], {
    message: "Please select a default view",
  }),
  enableAnalytics: z.boolean(),
});

const step4Schema = z.object({
  agreeToTerms: z.literal(true, {
    message: "You must agree to the Terms of Service",
  }),
});

const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

type FullFormData = z.infer<typeof fullSchema>;

/* -------------------------------------------------------------------------- */
/*                            Step definitions                                */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { id: 1, label: "Project Details", icon: FolderPlus },
  { id: 2, label: "Team Setup", icon: Users },
  { id: 3, label: "Preferences", icon: Settings },
  { id: 4, label: "Review", icon: ClipboardCheck },
] as const;

/* -------------------------------------------------------------------------- */
/*                          Step Indicator                                    */
/* -------------------------------------------------------------------------- */

function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: Set<number>;
}) {
  return (
    <div className="flex items-center justify-center w-full px-4 py-6">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.has(step.id);
        const isCurrent = currentStep === step.id;
        const isFuture = !isCompleted && !isCurrent;

        return (
          <React.Fragment key={step.id}>
            {/* Connector line (before every step except the first) */}
            {idx > 0 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-colors duration-300",
                  completedSteps.has(step.id) ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-full text-sm font-semibold transition-all duration-300 shrink-0",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  isFuture &&
                    "border-2 border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center transition-colors duration-300",
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Page                                     */
/* -------------------------------------------------------------------------- */

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");

  const form = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      category: undefined,
      teamSize: undefined,
      teamName: "",
      invitedMembers: [],
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      defaultView: undefined,
      enableAnalytics: true,
      agreeToTerms: undefined as unknown as true,
    },
    mode: "onTouched",
  });

  const { trigger, getValues, reset, setValue, watch } = form;
  const invitedMembers = watch("invitedMembers");

  /* ---- Step field mapping ---- */
  const stepFieldMap: Record<number, (keyof FullFormData)[]> = {
    1: ["projectName", "projectDescription", "category"],
    2: ["teamSize", "teamName", "invitedMembers"],
    3: [
      "emailNotifications",
      "pushNotifications",
      "weeklyDigest",
      "defaultView",
      "enableAnalytics",
    ],
    4: ["agreeToTerms"],
  };

  const validateCurrentStep = useCallback(async () => {
    const fields = stepFieldMap[currentStep];
    const result = await trigger(fields);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, trigger]);

  /* ---- Navigation ---- */
  const goToNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goToBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  /* ---- Add/remove members ---- */
  const addMember = () => {
    setMemberError("");
    const email = memberEmail.trim();
    if (!email) return;

    const emailSchema = z.string().email("Please enter a valid email address");
    const parseResult = emailSchema.safeParse(email);
    if (!parseResult.success) {
      setMemberError(
        parseResult.error.issues[0]?.message ?? "Invalid email"
      );
      return;
    }

    const current = getValues("invitedMembers") ?? [];
    if (current.includes(email)) {
      setMemberError("This email has already been added");
      return;
    }

    setValue("invitedMembers", [...current, email]);
    setMemberEmail("");
  };

  const removeMember = (email: string) => {
    const current = getValues("invitedMembers") ?? [];
    setValue(
      "invitedMembers",
      current.filter((m) => m !== email)
    );
  };

  /* ---- Submit ---- */
  const onSubmit = async () => {
    const valid = await trigger();
    if (!valid) return;

    toast.success("Project created successfully!");
    reset();
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setMemberEmail("");
    setMemberError("");
  };

  /* ---- Helpers ---- */
  const categoryLabel = (val: string | undefined) => val ?? "Not selected";
  const viewLabel = (val: string | undefined) => val ?? "Not selected";

  /* ---- Render ---- */
  return (
    <div className="mx-auto max-w-3xl py-8 px-4 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Project Setup Wizard
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new project in just a few steps
        </p>
      </div>

      {/* Step indicator */}
      <Card>
        <CardContent className="pt-6">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </CardContent>
      </Card>

      {/* Form card */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {STEPS[currentStep - 1].label}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your project"}
                {currentStep === 2 && "Configure your team settings"}
                {currentStep === 3 &&
                  "Set your notification and display preferences"}
                {currentStep === 4 &&
                  "Review your selections before creating the project"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Step transition wrapper */}
              <div
                key={currentStep}
                className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
              >
                {/* ========================= STEP 1 ========================= */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My Awesome Project"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this project is about..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SaaS">SaaS</SelectItem>
                              <SelectItem value="E-commerce">
                                E-commerce
                              </SelectItem>
                              <SelectItem value="Marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="Internal Tool">
                                Internal Tool
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ========================= STEP 2 ========================= */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Solo">Solo</SelectItem>
                              <SelectItem value="2-5">2-5</SelectItem>
                              <SelectItem value="6-15">6-15</SelectItem>
                              <SelectItem value="16-50">16-50</SelectItem>
                              <SelectItem value="50+">50+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Engineering Team"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Invite members */}
                    <div className="space-y-3">
                      <Label>Invite Members</Label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="colleague@company.com"
                          value={memberEmail}
                          onChange={(e) => {
                            setMemberEmail(e.target.value);
                            if (memberError) setMemberError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addMember();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addMember}
                          className="shrink-0"
                        >
                          <Plus className="size-4 me-1" />
                          Add
                        </Button>
                      </div>
                      {memberError && (
                        <p className="text-destructive text-sm">
                          {memberError}
                        </p>
                      )}

                      {invitedMembers && invitedMembers.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {invitedMembers.map((email) => (
                            <Badge
                              key={email}
                              variant="secondary"
                              className="gap-1 ps-2.5 pe-1 py-1"
                            >
                              {email}
                              <button
                                type="button"
                                onClick={() => removeMember(email)}
                                className="ms-1rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                                aria-label={`Remove ${email}`}
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================= STEP 3 ========================= */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Notification preferences */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">
                        Notification Preferences
                      </Label>

                      <FormField
                        control={form.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Email notifications
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Push notifications
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weeklyDigest"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Weekly digest
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Default view */}
                    <FormField
                      control={form.control}
                      name="defaultView"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default View</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select default view" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dashboard">
                                Dashboard
                              </SelectItem>
                              <SelectItem value="Kanban">Kanban</SelectItem>
                              <SelectItem value="Calendar">
                                Calendar
                              </SelectItem>
                              <SelectItem value="List">List</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* Analytics */}
                    <FormField
                      control={form.control}
                      name="enableAnalytics"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-normal cursor-pointer">
                              Enable Analytics
                            </FormLabel>
                            <FormDescription>
                              Collect anonymous usage data to help improve your
                              project&apos;s performance and user experience.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ========================= STEP 4 ========================= */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Project Details section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                          Project Details
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToStep(1)}
                          className="h-7 gap-1 text-xs text-muted-foreground"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Button>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium">
                            {getValues("projectName") || "\u2014"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Description
                          </span>
                          <span className="font-medium text-end max-w-[60%] truncate">
                            {getValues("projectDescription") || "\u2014"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category
                          </span>
                          <span className="font-medium">
                            {categoryLabel(getValues("category"))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Team Setup section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Team Setup</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToStep(2)}
                          className="h-7 gap-1 text-xs text-muted-foreground"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Button>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Team Size
                          </span>
                          <span className="font-medium">
                            {getValues("teamSize") || "\u2014"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Team Name
                          </span>
                          <span className="font-medium">
                            {getValues("teamName") || "\u2014"}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-muted-foreground">
                            Members
                          </span>
                          <div className="text-end">
                            {invitedMembers && invitedMembers.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-end">
                                {invitedMembers.map((email) => (
                                  <Badge
                                    key={email}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {email}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="font-medium text-muted-foreground">
                                None
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Preferences section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Preferences</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToStep(3)}
                          className="h-7 gap-1 text-xs text-muted-foreground"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Button>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Notifications
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {getValues("emailNotifications") && (
                              <Badge variant="secondary" className="text-xs">
                                Email
                              </Badge>
                            )}
                            {getValues("pushNotifications") && (
                              <Badge variant="secondary" className="text-xs">
                                Push
                              </Badge>
                            )}
                            {getValues("weeklyDigest") && (
                              <Badge variant="secondary" className="text-xs">
                                Weekly Digest
                              </Badge>
                            )}
                            {!getValues("emailNotifications") &&
                              !getValues("pushNotifications") &&
                              !getValues("weeklyDigest") && (
                                <span className="font-medium text-muted-foreground">
                                  None
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Default View
                          </span>
                          <span className="font-medium">
                            {viewLabel(getValues("defaultView"))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Analytics
                          </span>
                          <span className="font-medium">
                            {getValues("enableAnalytics")
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Terms */}
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-normal cursor-pointer">
                              By creating this project, you agree to our Terms
                              of Service
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>

            {/* Navigation footer */}
            <div className="flex items-center justify-between p-6 pt-2">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={goToBack}>
                  <ArrowLeft className="size-4 me-1.5" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={goToNext}>
                  Next
                  <ArrowRight className="size-4 ms-1.5" />
                </Button>
              ) : (
                <Button type="button" onClick={onSubmit}>
                  <FolderPlus className="size-4 me-1.5" />
                  Create Project
                </Button>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
