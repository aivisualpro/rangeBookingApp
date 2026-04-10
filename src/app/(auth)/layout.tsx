import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center flex-1 px-4 py-8">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Range Booking App</span>
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
