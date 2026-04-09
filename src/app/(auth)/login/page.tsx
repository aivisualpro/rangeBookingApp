"use client";

import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";

import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam && errorParam !== "AccountInactive" && errorParam !== "Your account is pending activation.") {
      toast.error("Error: " + errorParam);
    }
  }, [errorParam]);

  if (errorParam === "AccountInactive" || errorParam === "Your account is pending activation.") {
    return (
      <>
        <title>Account Pending — Range Booking</title>
        <Card className="w-full max-w-lg mx-auto shadow-xl">
          <CardHeader className="text-center pb-4 border-b">
            <CardTitle className="text-2xl text-amber-600">Waiting on Confirmation</CardTitle>
            <CardDescription className="text-base mt-2">
              Your account registration has been received and is currently under review by an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-sm text-foreground/80">
              You will receive an email once your account is activated and ready to use. 
              If you believe this is an error, please contact support.
            </p>
            <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      setSuccessAnim(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }

  return (
    <>
      <title>Sign In — Signal Dashboard</title>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="lazyOnload" />
      
      {successAnim && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all animate-in fade-in duration-500">
          <div dangerouslySetInnerHTML={{ __html: `<lottie-player src="/Login.json" background="transparent" speed="1" style="width: 300px; height: 300px;" autoplay></lottie-player>` }} />
          <h2 className="text-2xl font-bold mt-4 animate-pulse">Authenticating...</h2>
        </div>
      )}

      <Card className="w-full mx-auto max-w-md shadow-xl lg:max-w-[450px] animate-in fade-in slide-in-from-right-4 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="font-normal">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
