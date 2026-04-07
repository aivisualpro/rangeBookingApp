"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Mail, Pencil, Trash2 } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { getUserById, deleteUser, allPermissions } from "@dashboardpack/core/lib/data";
import type { UserRole, UserStatus } from "@dashboardpack/core/lib/data";

const statusVariant: Record<UserStatus, "success" | "secondary" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  suspended: "destructive",
};

const roleVariant: Record<UserRole, "default" | "secondary" | "warning" | "outline"> = {
  admin: "default",
  editor: "secondary",
  moderator: "warning",
  viewer: "outline",
};

export default function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const user = getUserById(id);

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

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title={user.name}
          description={user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Users", href: "/users" },
            { label: user.name },
          ]}
        >
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => router.push(`/users/${user.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="gap-1.5"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </PageHeader>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </CardTitle>
            <CardDescription>User profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {user.initials}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge
                  variant={roleVariant[user.role]}
                  className="capitalize text-[11px]"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium">{user.department}</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Account Details
            </CardTitle>
            <CardDescription>Account status and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={statusVariant[user.status]}
                className="capitalize text-[11px]"
              >
                {user.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium">{user.department}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Join Date</span>
              <span className="text-sm font-medium">{user.joinDate}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Active</span>
              <span className="text-sm font-medium">{user.lastActive}</span>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Permissions
            </CardTitle>
            <CardDescription>Granted access and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {allPermissions.map((perm) => {
                const granted = user.permissions.includes(perm.key);
                return (
                  <Badge
                    key={perm.key}
                    variant={granted ? "success" : "outline"}
                    className="justify-center text-[11px] py-1"
                  >
                    {perm.label}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete User"
        description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          deleteUser(user.id);
          router.push("/users");
        }}
      />
    </>
  );
}
