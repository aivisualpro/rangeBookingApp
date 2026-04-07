import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function AddingPagesPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Adding Pages</h1>
        <p className="text-sm text-muted-foreground">
          How to create new pages in the Signal Dashboard and integrate them into
          the sidebar navigation.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Adding a new page to the dashboard takes three steps: create the page
          file, add it to the navigation configuration, and optionally customize
          it. The page automatically inherits the dashboard layout (sidebar,
          header, and content shell) because it lives inside the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            (dashboard)
          </code>{" "}
          route group.
        </p>
      </section>

      {/* Step 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Step 1: Create the Page File
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a new directory and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            page.tsx
          </code>{" "}
          file inside{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/app/(dashboard)/
          </code>
          :
        </p>
        <CodeBlock code={`// src/app/(dashboard)/reports/page.tsx

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          View and generate reports for your business.
        </p>
      </div>

      {/* Your page content goes here */}
    </div>
  );
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          This page will be accessible at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            /reports
          </code>
          . The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            (dashboard)
          </code>{" "}
          route group does not appear in the URL.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Step 2: Add to Navigation
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Open{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/navigation.ts
          </code>{" "}
          and add a new entry to the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            navigationItems
          </code>{" "}
          array:
        </p>
        <CodeBlock code={`import {
  // ... existing imports
  FileBarChart,
} from "lucide-react";

export const navigationItems: NavItem[] = [
  // ... existing items
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
    keywords: ["reports", "analytics", "export"],
    group: "main",
  },
];`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The sidebar will automatically render the new link. You can add an
          optional{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            badge
          </code>{" "}
          property (e.g.,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            badge: &quot;New&quot;
          </code>
          ) to show a count or label next to the link.
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Step 3: Customize (Optional)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The page inherits the full dashboard layout automatically. You can
          enhance it with any of the available components:
        </p>
        <CodeBlock code={`// src/app/(dashboard)/reports/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            View and generate reports for your business.
          </p>
        </div>
        <Button>
          <Download className="size-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Revenue breakdown for the current month.
            </p>
          </CardContent>
        </Card>
        {/* More cards... */}
      </div>
    </div>
  );
}`} />
      </section>

      {/* Adding client components */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Client vs. Server Components</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By default, Next.js pages are server components. If your page needs
          interactivity (state, effects, event handlers), add the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            &quot;use client&quot;
          </code>{" "}
          directive at the top of the file:
        </p>
        <CodeBlock code={`"use client";

import { useState } from "react";

export default function InteractivePage() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          For better performance, keep pages as server components when possible
          and extract interactive parts into smaller client components.
        </p>
      </section>

      {/* Adding nested routes */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Nested Routes</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To create nested pages (e.g., a detail view), add subdirectories:
        </p>
        <CodeBlock code={`src/app/(dashboard)/reports/
├── page.tsx                # /reports (list view)
├── [id]/
│   └── page.tsx            # /reports/123 (detail view)
└── create/
    └── page.tsx            # /reports/create (form)`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Square brackets denote a dynamic segment. The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            params.id
          </code>{" "}
          value is available as a prop in the page component.
        </p>
      </section>

      {/* i18n Translation */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding Translations (i18n)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you want your page title and labels to support multiple languages,
          add translation keys to the JSON message files in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/i18n/messages/
          </code>
          . Each locale (en, de, fr) has its own file.
        </p>
        <CodeBlock code={`// src/lib/i18n/messages/en.json
{
  "reports": {
    "title": "Reports",
    "description": "View and generate reports."
  }
}

// src/lib/i18n/messages/de.json
{
  "reports": {
    "title": "Berichte",
    "description": "Berichte anzeigen und erstellen."
  }
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Then use the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useTranslations
          </code>{" "}
          hook in your component:
        </p>
        <CodeBlock code={`"use client";

import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

export default function ReportsPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("reports.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("reports.description")}
      </p>
    </div>
  );
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          To add the page to the sidebar with translation support, include a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            tKey
          </code>{" "}
          property in the navigation config pointing to the translation key.
          The sidebar will use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            t(tKey)
          </code>{" "}
          when available and fall back to the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            label
          </code>{" "}
          string otherwise.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Browse the{" "}
          <Link
            href="/docs/components"
            className="font-medium text-primary hover:underline"
          >
            Components
          </Link>{" "}
          page for a full list of available UI primitives, or learn about{" "}
          <Link
            href="/docs/theming"
            className="font-medium text-primary hover:underline"
          >
            Theming
          </Link>{" "}
          to customize the dashboard&apos;s appearance.
        </p>
      </section>
    </div>
  );
}
