import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function SeedStarterDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Seed / Starter Version</h1>
        <p className="text-sm text-muted-foreground">
          A minimal, clean starting point with all infrastructure but no demo
          pages or mock data.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            seed/
          </code>{" "}
          directory contains a standalone Next.js project that includes all the
          infrastructure from the full Signal Dashboard &mdash; theming, i18n,
          layouts, 33 UI components, Storybook and Vitest configurations &mdash;
          but none of the demo pages, mock data, or showcase content. It
          provides a clean foundation for building your own application.
        </p>
      </section>

      {/* Quick start */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quick Start</h2>
        <CodeBlock code={`# Copy seed to a new project directory
cp -r seed/ ../my-new-project
cd ../my-new-project

# Install dependencies
npm install

# Start dev server
npm run dev`} />
        <p className="text-sm text-muted-foreground">
          The dev server starts at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            http://localhost:3737
          </code>{" "}
          with two routes: Dashboard (home) and Settings.
        </p>
      </section>

      {/* What's included */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What&apos;s Included</h2>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Dashboard Shell</strong> &mdash;
            Sidebar, header, top-nav, command palette, page transitions
          </li>
          <li>
            <strong className="text-foreground">Theme System</strong> &mdash;
            Dark/light/system mode, 6 color presets, 3 density levels, RTL
            support, Theme Customizer drawer
          </li>
          <li>
            <strong className="text-foreground">i18n</strong> &mdash; Locale
            context, en/de/fr message files, locale switcher
          </li>
          <li>
            <strong className="text-foreground">33 UI Components</strong>{" "}
            &mdash; All vendored shadcn/ui primitives
          </li>
          <li>
            <strong className="text-foreground">Shared Components</strong>{" "}
            &mdash; PageHeader, EmptyState, LazyChart
          </li>
          <li>
            <strong className="text-foreground">Configs</strong> &mdash;
            TypeScript, ESLint, Vitest, Storybook, Tailwind CSS v4
          </li>
        </ul>
      </section>

      {/* What's NOT included */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What&apos;s Not Included</h2>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>Demo pages (Analytics, Servers, Containers, Kubernetes, etc.)</li>
          <li>Mock data layer (incidents, deployments, pipelines, logs)</li>
          <li>Auth pages (sign-in, sign-up, forgot password, etc.)</li>
          <li>Error/utility pages (404, 403, 500, maintenance, coming soon)</li>
          <li>Documentation site</li>
          <li>Storybook stories and Vitest test files (configs are included)</li>
        </ul>
      </section>

      {/* Project structure */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Project Structure</h2>
        <CodeBlock className="leading-relaxed" code={`seed/
├── .storybook/                 # Storybook configuration
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── settings/       # Settings page
│   │   │   ├── layout.tsx      # Dashboard shell
│   │   │   └── page.tsx        # Home (getting started cards)
│   │   ├── fonts/              # Local Geist fonts
│   │   ├── globals.css         # Tailwind + color tokens
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── dashboard/          # Sidebar, Header, Shell, Customizer
│   │   ├── shared/             # PageHeader, EmptyState, LazyChart
│   │   ├── ui/                 # 33 shadcn/ui components
│   │   └── theme-provider.tsx
│   └── lib/
│       ├── i18n/               # Locale context + message files
│       ├── navigation.ts       # Sidebar nav config (2 items)
│       └── utils.ts            # cn() utility
├── vitest.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json`} />
      </section>

      {/* Adding your first page */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding Your First Page</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The seed project&apos;s home page includes step-by-step cards explaining
          how to add pages, configure theming, and set up i18n. The process is
          identical to the full template:
        </p>
        <ol className="list-decimal space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            Create a page file in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/app/(dashboard)/your-page/page.tsx
            </code>
          </li>
          <li>
            Add a navigation entry in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/lib/navigation.ts
            </code>
          </li>
          <li>
            (Optional) Add translation keys to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/lib/i18n/messages/*.json
            </code>
          </li>
        </ol>
        <p className="text-sm text-muted-foreground leading-relaxed">
          See the{" "}
          <Link
            href="/docs/adding-pages"
            className="font-medium text-primary hover:underline"
          >
            Adding Pages
          </Link>{" "}
          guide for detailed instructions.
        </p>
      </section>

      {/* Back to full template */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Referencing the Full Template</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Need a DataTable, chart, or form pattern? Copy the relevant files from
          the full Signal Dashboard into your seed project. The component paths
          and import patterns are identical, so code is directly portable.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Explore the{" "}
          <Link
            href="/docs/theming"
            className="font-medium text-primary hover:underline"
          >
            Theming
          </Link>{" "}
          guide to customize colors and density, or the{" "}
          <Link
            href="/docs/i18n"
            className="font-medium text-primary hover:underline"
          >
            i18n
          </Link>{" "}
          guide to add new languages.
        </p>
      </section>
    </div>
  );
}
