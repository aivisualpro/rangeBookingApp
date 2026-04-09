"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Mail, Phone, Briefcase, Building, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const authUser = session?.user as any;

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const firstName = authUser.name?.split(" ")[0] || "User";
  const lastName = authUser.name?.split(" ").slice(1).join(" ") || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const role = authUser.role === "admin" ? "Administrator" : "Member";
  const companyName = authUser.companyName || "Internal Staff";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner / Hero */}
      <Card className="overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="-mt-12 h-24 w-24 ring-4 ring-background">
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-3xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {firstName} {lastName}
                  </h2>
                  <Badge variant={authUser.role === "admin" ? "default" : "secondary"}>{role}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Address
                </p>
                <p className="text-base font-medium pl-6">{authUser.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone Number
                </p>
                <p className="text-base font-medium pl-6">{authUser.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Account Type
                </p>
                <p className="text-base font-medium pl-6">{authUser.userType || "Internal"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building className="h-4 w-4" /> Company Association
                </p>
                <p className="text-base font-medium pl-6">{companyName}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> System Role
                </p>
                <p className="text-base font-medium pl-6">{role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
