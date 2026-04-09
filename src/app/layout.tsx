import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@dashboardpack/core/providers/theme-provider";
import { LocaleProvider } from "@dashboardpack/core/lib/i18n/locale-context";
import { Toaster } from "@dashboardpack/core/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Range Booking App",
  description: "Schedule and manage range bookings securely in real-time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RangeBooking",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem("signal-density");if(d&&["compact","comfortable","spacious"].includes(d)){document.documentElement.classList.add("density-"+d)}else{document.documentElement.classList.add("density-comfortable")}}catch(e){document.documentElement.classList.add("density-comfortable")}})();
(function(){try{var c=localStorage.getItem("signal-color-preset");var p={"matrix":[165,0.22],"cyan":[195,0.18],"violet":[280,0.18],"amber":[60,0.18],"red":[25,0.20],"frost":[220,0.04]};if(c&&p[c]){var s=document.documentElement.style;var v="oklch(0.55 "+p[c][1]+" "+p[c][0]+")";s.setProperty("--primary",v);s.setProperty("--primary-foreground","oklch(1 0 0)");s.setProperty("--sidebar-primary",v);s.setProperty("--chart-1",v);s.setProperty("--ring",v)}}catch(e){}})();
(function(){try{var l=localStorage.getItem("signal-layout");if(l==="topnav"){document.documentElement.classList.add("layout-topnav")}else{document.documentElement.classList.add("layout-sidebar")}}catch(e){document.documentElement.classList.add("layout-sidebar")}})();
(function(){try{var b=localStorage.getItem("signal-container");if(b==="boxed"){document.documentElement.classList.add("container-boxed")}else{document.documentElement.classList.add("container-fluid")}}catch(e){document.documentElement.classList.add("container-fluid")}})();
(function(){try{var r=localStorage.getItem("signal-direction");if(r==="rtl"){document.documentElement.dir="rtl";document.documentElement.classList.add("dir-rtl")}else{document.documentElement.dir="ltr";document.documentElement.classList.add("dir-ltr")}}catch(e){document.documentElement.dir="ltr";document.documentElement.classList.add("dir-ltr")}})();
(function(){try{var f=localStorage.getItem("signal-font");if(f==="inter"){document.documentElement.classList.add("font-inter")}else{document.documentElement.classList.add("font-jetbrains")}}catch(e){document.documentElement.classList.add("font-jetbrains")}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system">
          <LocaleProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none"
            >
              Skip to content
            </a>
            <AuthProvider>
              {children}
              <Toaster richColors closeButton />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
