import Link from "next/link";
import { Badge } from "@dashboardpack/core/components/ui/badge";

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="text-sm text-muted-foreground">
          A record of all notable changes to Signal Dashboard.
        </p>
      </div>

      {/* v2.1.0 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">v2.1.0</h2>
          <Badge variant="default">Latest</Badge>
          <span className="text-sm text-muted-foreground">
            February 2026
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          User management, Storybook component library, internationalization, and performance optimizations.
        </p>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">User Management</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Users list page with DataTable, role/status filters, and CRUD operations</li>
            <li>User detail page with profile card, permissions grid, and account details</li>
            <li>Create and edit forms with React Hook Form + Zod validation</li>
            <li>25 mock users with roles, permissions, and departments</li>
          </ul>

          <h3 className="text-sm font-medium">Storybook</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Storybook 8.x with 15 component stories across core, form, and dashboard tiers</li>
            <li>Dark mode decorator and responsive viewport presets</li>
            <li>Auto-docs enabled for all stories</li>
          </ul>

          <h3 className="text-sm font-medium">Internationalization (i18n)</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Custom i18n with React Context and type-safe translation keys</li>
            <li>3 languages: English, German, French</li>
            <li>~80 translation keys covering sidebar, header, and dashboard</li>
            <li>Locale switcher in Theme Customizer and Settings</li>
          </ul>

          <h3 className="text-sm font-medium">Performance</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Bundle analyzer integration with npm run analyze</li>
            <li>Dynamic imports for chart components on dashboard home</li>
            <li>LazyChart wrapper using IntersectionObserver for viewport-triggered rendering</li>
          </ul>
        </div>
      </section>

      {/* v2.0.0 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">v2.0.0</h2>
          <span className="text-sm text-muted-foreground">
            February 2026
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Major update covering Phases 1-9 of the product roadmap.
        </p>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Dashboard Variations</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Servers dashboard with CPU/memory charts, fleet status donut, top hosts</li>
            <li>Containers dashboard with resource utilization, image registry, pod health</li>
            <li>Kubernetes dashboard with cluster metrics, node status, workload tracking</li>
          </ul>

          <h3 className="text-sm font-medium">App Pages</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Chat application with real-time messaging UI and conversation list</li>
            <li>Email/Inbox client with folders, compose dialog, and search</li>
            <li>File Manager with grid/list views, upload, and storage stats</li>
            <li>Kanban board with drag-and-drop task management</li>
            <li>Calendar with monthly view and event management</li>
            <li>Multi-step wizard form with validation</li>
            <li>User profile page with overview, activity, and connections tabs</li>
            <li>Pricing page with plan comparison</li>
          </ul>

          <h3 className="text-sm font-medium">Advanced Components</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>TanStack Table upgrade with column filtering, sorting, pagination, CSV export, mobile responsive cards</li>
            <li>Date Picker, Date Range Picker</li>
            <li>Combobox/Autocomplete, Multi-Select, Phone Input</li>
            <li>File Uploader (react-dropzone), OTP Input, Color Picker</li>
            <li>Accordion, Alert, Carousel, Collapsible, Scroll Area, Slider, Toggle Group, Resizable</li>
          </ul>

          <h3 className="text-sm font-medium">Charts Showcase</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>New /charts page with Radar, Radial Bar, Treemap, Scatter, and Composed charts</li>
            <li>10 chart types total (Area, Bar, Line, Pie, Sparkline, Radar, RadialBar, Treemap, Scatter, Composed)</li>
          </ul>

          <h3 className="text-sm font-medium">Theme Customizer</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Live customizer drawer with color presets, density options</li>
            <li>6 color presets: Default, Ocean, Sunset, Forest, Berry, Slate</li>
            <li>3 density levels: Compact, Default, Comfortable</li>
            <li>Reset to defaults</li>
          </ul>

          <h3 className="text-sm font-medium">Layout Options</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Horizontal top-nav layout alternative</li>
            <li>Boxed container option (max-width centered)</li>
            <li>All layouts persist to localStorage</li>
          </ul>

          <h3 className="text-sm font-medium">RTL Support</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Full right-to-left text direction support</li>
            <li>CSS logical properties across all components</li>
            <li>Toggle in Theme Customizer</li>
          </ul>

          <h3 className="text-sm font-medium">Auth & Utility Pages</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Reset Password, Two-Factor Authentication, Email Verification, Lock Screen</li>
            <li>500 Server Error, 403 Forbidden error pages</li>
            <li>Coming Soon and Maintenance pages</li>
          </ul>

          <h3 className="text-sm font-medium">Testing Infrastructure</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Vitest unit testing with jsdom environment</li>
            <li>Playwright E2E tests with Chromium</li>
            <li>Representative test suites for utilities, data, and components</li>
          </ul>
        </div>
      </section>

      {/* v1.0.0 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">v1.0.0</h2>
          <span className="text-sm text-muted-foreground">
            February 2026
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Initial release of Signal Dashboard.
        </p>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Dashboard</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Overview page with stats cards, revenue chart, traffic pie chart, and goals progress</li>
            <li>Analytics page with detailed chart breakdowns</li>
            <li>Collapsible sidebar with icon-only mode</li>
            <li>Responsive header with search, notifications, and user menu</li>
          </ul>

          <h3 className="text-sm font-medium">Pages</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Deployments page with data table, sorting, filtering, and CRUD operations</li>
            <li>Incidents management with severity levels and timeline views</li>
            <li>Pipelines monitoring with build status and run history</li>
            <li>Billing page with plan selection and payment history</li>
            <li>Invoices list with status badges</li>
            <li>Notifications center with read/unread states</li>
            <li>Settings page with profile, appearance, and notification preferences</li>
            <li>Help and support page</li>
          </ul>

          <h3 className="text-sm font-medium">Authentication</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Sign-in page with email/password form and social login buttons</li>
            <li>Sign-up page with form validation using React Hook Form and Zod</li>
          </ul>

          <h3 className="text-sm font-medium">UI Components</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>25+ vendored shadcn/ui components (Button, Card, Dialog, Table, Tabs, etc.)</li>
            <li>Command palette (Cmd+K) for quick navigation</li>
            <li>Toast notifications via Sonner</li>
            <li>Confirm dialog for destructive actions</li>
          </ul>

          <h3 className="text-sm font-medium">Theming</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Dark, light, and system theme modes</li>
            <li>OKLCh color tokens for perceptually uniform colors</li>
            <li>Semantic color system (primary, success, warning, destructive)</li>
            <li>5-color chart palette</li>
            <li>Custom dark sidebar in both light and dark modes</li>
          </ul>

          <h3 className="text-sm font-medium">Tech Stack</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Next.js 16 with App Router</li>
            <li>React 19</li>
            <li>TypeScript 5 with strict mode</li>
            <li>Tailwind CSS v4</li>
            <li>Recharts for data visualization</li>
            <li>Lucide React icons</li>
            <li>React Hook Form + Zod for form validation</li>
            <li>Radix UI primitives</li>
          </ul>

          <h3 className="text-sm font-medium">Documentation</h3>
          <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
            <li>Built-in documentation site at /docs</li>
            <li>Installation guide, folder structure, theming, components, and deployment docs</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <section className="space-y-3 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Back to the{" "}
          <Link
            href="/docs"
            className="font-medium text-primary hover:underline"
          >
            Introduction
          </Link>{" "}
          or view the{" "}
          <Link
            href="/docs/deployment"
            className="font-medium text-primary hover:underline"
          >
            Deployment Guide
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
