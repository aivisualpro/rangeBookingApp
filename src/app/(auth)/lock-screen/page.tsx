"use client";

import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";

export default function LockScreenPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.info("Demo mode — no backend connected");
  }

  return (
    <>
      <title>Lock Screen — Signal Dashboard</title>
      <Card>
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-16 w-16">
            <AvatarFallback className="text-lg font-bold">AS</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Aigars Silkalns</CardTitle>
          <CardDescription>aigars@signal.dev</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not you?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in with a different account
            </Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
