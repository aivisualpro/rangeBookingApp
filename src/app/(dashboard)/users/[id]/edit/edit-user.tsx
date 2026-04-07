"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import {
  getUserById,
  updateUser,
  allPermissions,
  departments,
} from "@dashboardpack/core/lib/data";
import type { UserRole, UserStatus } from "@dashboardpack/core/lib/data";
import { User } from "lucide-react";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "editor", "viewer", "moderator"]),
  department: z.string().min(1, "Please select a department"),
  status: z.enum(["active", "inactive", "suspended"]),
  permissions: z.array(z.string()),
});

type UserFormValues = z.infer<typeof userSchema>;

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const user = getUserById(id);

  const form = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role as UserFormValues["role"]) ?? "viewer",
      department: user?.department ?? "",
      status: (user?.status as UserFormValues["status"]) ?? "active",
      permissions: user?.permissions ?? [],
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-1">
          User not found
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The user &quot;{id}&quot; does not exist or has been deleted.
        </p>
        <Button variant="outline" onClick={() => router.push("/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  function onSubmit(values: UserFormValues) {
    updateUser(id, {
      name: values.name,
      email: values.email,
      initials: generateInitials(values.name),
      role: values.role as UserRole,
      status: values.status as UserStatus,
      department: values.department,
      permissions: values.permissions,
    });

    toast.success("User updated successfully!");
    router.push(`/users/${id}`);
  }

  // Group permissions by their group property
  const permissionGroups = allPermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) {
        acc[perm.group] = [];
      }
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof allPermissions>
  );

  return (
    <>
      

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Modify the fields below and save to update this user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Emma Wilson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. emma@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Object.entries(permissionGroups).map(
                        ([group, perms]) => (
                          <div key={group} className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              {group}
                            </p>
                            {perms.map((perm) => (
                              <FormField
                                key={perm.key}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          perm.key
                                        )}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([
                                              ...field.value,
                                              perm.key,
                                            ]);
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (v: string) => v !== perm.key
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {perm.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        )
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/users/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
