import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function StorybookDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Storybook</h1>
        <p className="text-sm text-muted-foreground">
          Visual component browser with 15 interactive stories for developing
          and testing UI components in isolation.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Storybook provides a sandboxed environment to visually develop, test,
          and document your components. Each story renders a component with
          specific props, allowing you to see all variants, sizes, and states
          without navigating through the full application.
        </p>
      </section>

      {/* Getting started */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <CodeBlock code={`# Start Storybook dev server
npm run storybook

# Build static Storybook for deployment
npm run build-storybook`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Storybook opens at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            http://localhost:6006
          </code>
          . The static build outputs to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            storybook-static/
          </code>{" "}
          (gitignored).
        </p>
      </section>

      {/* Included stories */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Included Stories</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The project ships with 15 stories organized in three tiers:
        </p>

        <h3 className="text-sm font-medium">Core Primitives (6)</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">Component</th>
                <th className="px-4 py-2 text-start font-medium">Variants</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">Button</td>
                <td className="px-4 py-2 text-muted-foreground">
                  6 variants &times; 4 sizes, loading, disabled, with icon
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">Badge</td>
                <td className="px-4 py-2 text-muted-foreground">
                  6 variants (default, secondary, destructive, success, warning, outline)
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">Card</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Basic, with header/content/footer, nested content
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">Input</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Default, with label, disabled, with icon, error state
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">Dialog</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Basic, with form, confirm action
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">Tabs</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Default tabs, with content panels
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium">Form Components (5)</h3>
        <p className="text-sm text-muted-foreground">
          Select, Checkbox, Switch, Textarea, Slider
        </p>

        <h3 className="text-sm font-medium">Dashboard Components (4)</h3>
        <p className="text-sm text-muted-foreground">
          StatsCards, DataTable, PageHeader, EmptyState
        </p>
      </section>

      {/* Writing stories */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Writing New Stories</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .stories.tsx
          </code>{" "}
          file next to the component:
        </p>
        <CodeBlock code={`// src/components/ui/alert.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This is an alert message.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong.
      </AlertDescription>
    </Alert>
  ),
};`} />
      </section>

      {/* Configuration */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Configuration</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Storybook configuration lives in the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .storybook/
          </code>{" "}
          directory:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">main.ts</strong> &mdash;
            Framework config (
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              @storybook/react-vite
            </code>
            ), autodocs, story file patterns
          </li>
          <li>
            <strong className="text-foreground">preview.ts</strong> &mdash;
            Global CSS imports, dark mode decorator, viewport presets
          </li>
        </ul>
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
          page for a full list of available primitives, or see the{" "}
          <Link
            href="/docs/testing"
            className="font-medium text-primary hover:underline"
          >
            Testing
          </Link>{" "}
          guide for unit and E2E tests.
        </p>
      </section>
    </div>
  );
}
