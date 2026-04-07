import Link from "next/link";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function DocsIntroductionPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="text-sm text-muted-foreground">
          A modern, production-ready admin dashboard built with Next.js 16,
          React 19, TypeScript 5, and Tailwind CSS v4 &mdash; 125+ static
          routes, fully responsive, dark/light/system theme, RTL support, and
          everything you need to ship fast.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What is Signal Dashboard?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Signal Dashboard is a feature-rich admin template designed for building
          internal tools, SaaS applications, and back-office dashboards. It
          provides a solid foundation with pre-built components, pages, and
          patterns so you can focus on shipping your product instead of building
          boilerplate UI. With five dashboard variations, 20+ app pages, a live
          Theme Customizer, i18n support, Storybook component browser, and a
          comprehensive set of auth and error pages, it covers every scenario a
          modern admin panel needs out of the box.
        </p>
      </section>

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Features</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4</strong>{" "}
              &mdash; App Router with server and client components, strict
              typing, and utility-first styling with OKLCh color tokens
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">5 Dashboard Variations</strong>{" "}
              &mdash; Overview, Analytics, Servers, Containers, and Kubernetes dashboards,
              each with unique layouts and chart compositions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">10+ App Pages</strong>{" "}
              &mdash; Pipelines, Incidents, Logs, Uptime, Databases, Security,
              API Monitoring, Cloud Costs, Status Page, Deployments, Profile, Settings,
              Support, and Billing pages with full interactivity
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Charts Showcase</strong>{" "}
              &mdash; Area, Bar, Pie, Radar, RadialBar, Treemap, Scatter, and
              Composed charts powered by Recharts
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Theme Customizer</strong>{" "}
              &mdash; Live drawer panel with 6 color presets (Default, Ocean,
              Sunset, Forest, Berry, Slate), 3 density levels (Compact, Default,
              Comfortable), dark/light/system theme, and persistent preferences
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Layout Options</strong>{" "}
              &mdash; Sidebar (default) or horizontal top-nav layout, plus fluid
              (full-width) or boxed (max-width centered) container modes
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">RTL Support</strong>{" "}
              &mdash; Full right-to-left language support for Arabic, Hebrew,
              Persian, and more, toggled via the Theme Customizer
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">35+ shadcn/ui Components</strong>{" "}
              &mdash; Vendored, accessible, and fully customizable primitives
              built on Radix UI with CVA variants
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">TanStack Table</strong>{" "}
              &mdash; Sortable, filterable, paginated data tables with CSV
              export and mobile-responsive card views
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Auth Pages</strong>{" "}
              &mdash; Sign-in, sign-up, forgot password, reset password, two-factor
              authentication, email verification, and lock screen templates
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Error Pages</strong>{" "}
              &mdash; 404 Not Found, 403 Forbidden, 500 Server Error, Coming
              Soon, and Maintenance pages
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Command Palette (Cmd+K)</strong>{" "}
              &mdash; Quick navigation and search across all pages and actions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Drag-and-Drop Kanban</strong>{" "}
              &mdash; Interactive task board with draggable cards across columns
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Framer Motion Page Transitions</strong>{" "}
              &mdash; Smooth animated transitions between routes and interactive
              UI elements
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">React Hook Form + Zod Validation</strong>{" "}
              &mdash; Type-safe form handling with schema-based validation
              across all form pages
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Vitest + Playwright Testing</strong>{" "}
              &mdash; Unit and component testing with Vitest, end-to-end testing
              with Playwright
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Internationalization (i18n)</strong>{" "}
              &mdash; Built-in locale system with English, German, and French
              translations, localStorage persistence, and a locale switcher in
              Settings and Theme Customizer
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">User Management &amp; RBAC</strong>{" "}
              &mdash; Full CRUD user pages with roles (Admin, Editor, Viewer,
              Moderator), permissions grid, department filters, and status management
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Storybook Component Browser</strong>{" "}
              &mdash; 15 interactive stories across UI primitives, form components,
              and dashboard widgets for visual development and testing
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Performance Optimizations</strong>{" "}
              &mdash; Lazy-loaded charts with IntersectionObserver, next/dynamic code
              splitting, and bundle analyzer integration
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Seed/Starter Version</strong>{" "}
              &mdash; A minimal, stripped-down starter project with all infrastructure
              (theming, i18n, layouts, 33 UI components) but no demo pages or mock data
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Fully Responsive</strong>{" "}
              &mdash; Collapsible sidebar, mobile-first layout, and
              touch-friendly interactions across 125+ static routes
            </span>
          </li>
        </ul>
      </section>

      {/* Quick Start */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quick Start</h2>
        <p className="text-sm text-muted-foreground">
          Get up and running in under a minute:
        </p>
        <CodeBlock code={`git clone https://github.com/colorlib/signal-dashboard.git
cd signal-dashboard
npm install
npm run dev`} />
        <p className="text-sm text-muted-foreground">
          Then open{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            http://localhost:3737
          </code>{" "}
          in your browser.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Next.js 16</Badge>
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">TypeScript 5</Badge>
          <Badge variant="secondary">Tailwind CSS v4</Badge>
          <Badge variant="secondary">Recharts</Badge>
          <Badge variant="secondary">Lucide Icons</Badge>
          <Badge variant="secondary">Radix UI</Badge>
          <Badge variant="secondary">React Hook Form</Badge>
          <Badge variant="secondary">Zod</Badge>
          <Badge variant="secondary">cmdk</Badge>
          <Badge variant="secondary">Framer Motion</Badge>
          <Badge variant="secondary">TanStack Table</Badge>
          <Badge variant="secondary">Vitest</Badge>
          <Badge variant="secondary">Playwright</Badge>
          <Badge variant="secondary">Storybook</Badge>
        </div>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Ready to dive in? Continue with the{" "}
          <Link
            href="/docs/getting-started"
            className="font-medium text-primary hover:underline"
          >
            Installation Guide
          </Link>{" "}
          for detailed setup instructions, or explore the{" "}
          <Link
            href="/docs/folder-structure"
            className="font-medium text-primary hover:underline"
          >
            Folder Structure
          </Link>{" "}
          to understand the project layout.
        </p>
      </section>
    </div>
  );
}
