"use client";

import { toast } from "sonner";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";

export default function VerifyEmailPage() {
  function handleResend() {
    toast.info("Demo mode — verification email resent");
  }

  return (
    <>
      <title>Verify Email — Signal Dashboard</title>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Click the link in the email to verify your account. If you
            don&apos;t see it, check your spam folder.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
          >
            Resend verification email
          </Button>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
