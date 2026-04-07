"use client";

import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";

export default function ComingSoonPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.info("Demo mode — no backend connected");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">
      {/* Decorative background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.55 0.175 160 / 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      {/* Icon */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 animate-bounce">
        <Rocket className="h-7 w-7 text-primary-foreground" />
      </div>

      {/* Gradient heading */}
      <h1
        className="mt-8 text-5xl font-extrabold tracking-tighter sm:text-7xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.175 160), oklch(0.58 0.14 195), oklch(0.60 0.16 250))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Coming Soon
      </h1>

      <p className="mt-3 text-xl font-medium text-foreground">
        Something awesome is brewing
      </p>
      <p className="mt-1 max-w-md text-base text-muted-foreground">
        We&apos;re working hard on this feature. Enter your email to be the
        first to know when it launches.
      </p>

      {/* Email signup */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-sm gap-2"
      >
        <Input
          type="email"
          placeholder="name@example.com"
          required
          className="flex-1"
        />
        <Button type="submit" size="lg">
          Notify Me
        </Button>
      </form>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
