import Image from "next/image";
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
          className="mb-8 flex flex-col items-center justify-center gap-4 transition-transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center overflow-hidden bg-transparent">
            <Image src="/logo.png" unoptimized alt="Range Booking App" width={96} height={96} className="object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Range Booking App</span>
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
