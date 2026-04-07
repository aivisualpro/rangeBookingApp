import Link from "next/link";
import { ArrowLeft, Headset, Zap } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";

export default function ForbiddenPage() {
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

      {/* Logo */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 animate-pulse">
        <Zap className="h-7 w-7 text-primary-foreground" />
      </div>

      {/* Gradient heading */}
      <h1
        className="mt-8 text-8xl font-extrabold tracking-tighter sm:text-9xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.175 160), oklch(0.58 0.14 195), oklch(0.60 0.16 250))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        403
      </h1>

      <p className="mt-3 text-xl font-medium text-foreground">
        Access denied
      </p>
      <p className="mt-1 max-w-md text-base text-muted-foreground">
        You don&apos;t have permission to access this page. Contact your
        administrator if you believe this is a mistake.
      </p>

      {/* Action buttons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/support">
            <Headset className="size-4" />
            Go to Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
