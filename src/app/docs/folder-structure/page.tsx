import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function FolderStructurePage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Folder Structure</h1>
        <p className="text-sm text-muted-foreground">
          An overview of the project directory layout and what each part is
          responsible for.
        </p>
      </div>

      {/* Directory tree */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Project Tree</h2>
        <CodeBlock className="leading-relaxed" code={`signal-dashboard/
├── public/                     # Static assets (favicon, images)
├── e2e/                        # Playwright end-to-end tests
│   └── smoke.spec.ts
├── src/
│   ├── app/
│   │   ├── (auth)/             # Auth pages (standalone layout)
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── two-factor/
│   │   │   ├── verify-email/
│   │   │   └── lock-screen/
│   │   ├── (dashboard)/        # Dashboard routes (sidebar + header layout)
│   │   │   ├── analytics/
│   │   │   ├── billing/
│   │   │   ├── calendar/
│   │   │   ├── charts/         # Charts showcase (Radar, Treemap, etc.)
│   │   │   ├── chat/
│   │   │   ├── servers/         # Server fleet monitoring
│   │   │   ├── containers/      # Docker container management
│   │   │   ├── kubernetes/      # K8s cluster overview
│   │   │   ├── deployments/     # CI/CD deployment history
│   │   │   ├── incidents/       # Incident management (CRUD)
│   │   │   ├── logs/            # Log aggregation & search
│   │   │   ├── uptime/          # Uptime monitors & SLAs
│   │   │   ├── pipelines/       # CI/CD pipeline runs
│   │   │   ├── databases/       # Database health & queries
│   │   │   ├── security/        # Vulnerability scanning
│   │   │   ├── api-monitoring/  # API latency & errors
│   │   │   ├── costs/           # Cloud cost tracking
│   │   │   ├── status/          # Public status page
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── support/
│   │   │   ├── users/           # User management (CRUD, roles, permissions)
│   │   │   ├── billing/
│   │   │   ├── layout.tsx      # Dashboard shell (sidebar + header)
│   │   │   └── page.tsx        # Home / overview
│   │   ├── docs/               # Built-in documentation site
│   │   ├── fonts/              # Local font files (Geist)
│   │   ├── globals.css         # Tailwind config + OKLCh color tokens
│   │   ├── layout.tsx          # Root layout (ThemeProvider, fonts)
│   │   └── not-found.tsx       # Custom 404 page
│   ├── components/
│   │   ├── dashboard/          # Sidebar, Header, Shell, Charts, Customizer
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-context.tsx
│   │   │   ├── header.tsx
│   │   │   ├── dashboard-shell.tsx
│   │   │   ├── theme-customizer.tsx
│   │   │   ├── top-nav.tsx
│   │   │   └── ...
│   │   ├── shared/             # DataTable, PageHeader, ConfirmDialog, etc.
│   │   │   └── data-table/     # TanStack Table components
│   │   ├── ui/                 # 35+ shadcn/ui primitives (vendored)
│   │   └── theme-provider.tsx  # Dark/light/system theme context
│   ├── lib/
│   │   ├── data/               # Mock data layer with CRUD helpers
│   │   ├── i18n/              # Internationalization (locale context, messages)
│   │   ├── navigation.ts       # Dashboard sidebar nav config
│   │   ├── docs-navigation.ts  # Docs sidebar nav config
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│   └── test/                   # Vitest setup and type declarations
├── vitest.config.ts            # Vitest test configuration
├── playwright.config.ts        # Playwright E2E configuration
├── components.json             # shadcn/ui CLI configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── .storybook/                 # Storybook configuration
├── seed/                       # Seed/Starter version (clean starting point)
└── package.json`} />
      </section>

      {/* Explanation */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Key Directories</h2>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/app/(dashboard)/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All dashboard pages live inside this route group. The parentheses
          tell Next.js this is a grouping folder &mdash; it does not appear in
          the URL. Every page here automatically inherits the dashboard layout
          (sidebar, header, and content shell).
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/app/(auth)/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Authentication and utility pages (sign-in, sign-up, forgot
          password, reset password, two-factor, email verification, lock
          screen) have their own layout without the dashboard chrome. They
          use a centered card design.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/app/docs/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The documentation site (what you are reading now). It lives outside
          the route groups and has its own dedicated layout with a sidebar
          navigation.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/components/ui/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vendored shadcn/ui components. These are not installed from a
          package &mdash; they are source files you own and can customize
          freely. Each component uses CVA for variants and the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            cn()
          </code>{" "}
          utility for class merging.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/components/dashboard/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Higher-level components that compose the dashboard UI: sidebar,
          header, theme customizer, top-nav, stats cards, charts, data
          tables, and activity feeds.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Shared utilities, mock data, and configuration. The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            navigation.ts
          </code>{" "}
          file defines all sidebar links. The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            utils.ts
          </code>{" "}
          file exports the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            cn()
          </code>{" "}
          class-merging function used throughout the project.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/i18n/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Internationalization infrastructure. Contains locale configuration,
          a React context provider with localStorage persistence, and JSON
          message files for English, German, and French.
        </p>

        <h3 className="text-sm font-medium">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            seed/
          </code>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A standalone starter project with all infrastructure (theming, i18n,
          layouts, UI components, Storybook/Vitest configs) but no demo pages
          or mock data. Copy it to start a new project from scratch.
        </p>
      </section>

      {/* Path aliases */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Path Aliases</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The project uses a single path alias configured in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            tsconfig.json
          </code>
          :
        </p>
        <CodeBlock code={`"@/*" → "src/*"

// Usage:
import { Button } from "@dashboardpack/core/components/ui/button";
import { cn } from "@dashboardpack/core/lib/utils";`} />
        <p className="text-sm text-muted-foreground">
          All imports throughout the project use this alias instead of relative
          paths.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Learn how to customize the look and feel in the{" "}
          <Link
            href="/docs/theming"
            className="font-medium text-primary hover:underline"
          >
            Theming
          </Link>{" "}
          guide, or see how to{" "}
          <Link
            href="/docs/adding-pages"
            className="font-medium text-primary hover:underline"
          >
            add new pages
          </Link>{" "}
          to the dashboard.
        </p>
      </section>
    </div>
  );
}
