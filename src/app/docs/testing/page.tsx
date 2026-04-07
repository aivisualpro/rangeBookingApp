import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function TestingDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Testing</h1>
        <p className="text-sm text-muted-foreground">
          Signal Dashboard ships with Vitest for unit tests and Playwright for
          end-to-end tests, ready to extend.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The testing setup includes two tools that cover different layers of
          confidence:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Vitest</strong> &mdash; Fast
            unit and component tests running in a jsdom environment. Tests
            utility functions, mock data integrity, and component rendering.
          </li>
          <li>
            <strong className="text-foreground">Playwright</strong> &mdash;
            Browser-based end-to-end tests that verify pages load, navigation
            works, and interactive features function correctly.
          </li>
        </ul>
      </section>

      {/* Scripts */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Test Scripts</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">Command</th>
                <th className="px-4 py-2 text-start font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run Vitest in watch mode (re-runs on file changes)
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test:run</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run Vitest once and exit (CI-friendly)
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test:e2e</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run Playwright end-to-end tests
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">
                    npm run test:e2e:ui
                  </code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Open Playwright interactive UI mode for debugging
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Vitest */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Unit Tests (Vitest)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vitest is configured in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            vitest.config.ts
          </code>{" "}
          at the project root. Key settings:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Environment:</strong> jsdom
            (simulates browser DOM)
          </li>
          <li>
            <strong className="text-foreground">Globals:</strong> enabled (
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              describe
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              it
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              expect
            </code>{" "}
            available without imports)
          </li>
          <li>
            <strong className="text-foreground">Path aliases:</strong> resolved
            via vite-tsconfig-paths (
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              @/*
            </code>{" "}
            works in tests)
          </li>
          <li>
            <strong className="text-foreground">Setup file:</strong>{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/test/setup.ts
            </code>{" "}
            registers @testing-library/jest-dom matchers
          </li>
          <li>
            <strong className="text-foreground">CSS:</strong> disabled for
            faster test execution
          </li>
        </ul>

        <h3 className="text-sm font-medium">Included Test Files</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">File</th>
                <th className="px-4 py-2 text-start font-medium">Tests</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/utils.test.ts
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  cn() utility &mdash; class merging, Tailwind conflict
                  resolution, edge cases
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/data/analytics.test.ts
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Mock data integrity &mdash; field validation, array lengths,
                  traffic sources sum to 100%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">
                  src/components/dashboard/stats-cards.test.tsx
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  StatsCards component &mdash; renders all 4 cards with values
                  and trend indicators
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Writing Tests */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Writing New Unit Tests</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a file with a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .test.ts
          </code>{" "}
          or{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .test.tsx
          </code>{" "}
          extension alongside the source file:
        </p>
        <CodeBlock code={`// src/lib/my-utils.test.ts
import { formatCurrency } from "@/lib/my-utils";

describe("formatCurrency", () => {
  it("formats USD amounts", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          For component tests, mock Recharts to avoid SVG rendering issues in
          jsdom:
        </p>
        <CodeBlock code={`vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: ({ children }) => <div>{children}</div>,
  Area: () => null,
}));`} />
      </section>

      {/* Playwright */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">E2E Tests (Playwright)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Playwright is configured in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            playwright.config.ts
          </code>{" "}
          at the project root. It automatically starts the dev server on port
          3737 before running tests.
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Browser:</strong> Chromium only
            (add Firefox/WebKit in the config as needed)
          </li>
          <li>
            <strong className="text-foreground">Test directory:</strong>{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              e2e/
            </code>
          </li>
          <li>
            <strong className="text-foreground">Traces:</strong> captured on
            first retry for debugging failures
          </li>
        </ul>

        <h3 className="text-sm font-medium">Included Smoke Tests</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            e2e/smoke.spec.ts
          </code>{" "}
          file includes 4 tests:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>Homepage loads with the Dashboard heading</li>
          <li>Sidebar navigation navigates between pages</li>
          <li>Charts page renders all 5 chart cards</li>
          <li>Theme toggle switches between light and dark modes</li>
        </ul>
      </section>

      {/* Writing E2E Tests */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Writing New E2E Tests</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .spec.ts
          </code>{" "}
          files in the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            e2e/
          </code>{" "}
          directory:
        </p>
        <CodeBlock code={`import { test, expect } from "@playwright/test";

test("servers page shows data table", async ({ page }) => {
  await page.goto("/servers");
  await expect(page.getByRole("heading", { name: "Servers" })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
});`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            npm run test:e2e:ui
          </code>{" "}
          for interactive debugging with time-travel, DOM snapshots, and
          step-through execution.
        </p>
      </section>

      {/* CI Integration */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">CI Integration</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For continuous integration, use the single-run commands:
        </p>
        <CodeBlock code={`npm run test:run     # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Playwright automatically enables retries and single-worker mode when
          the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            CI
          </code>{" "}
          environment variable is set.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          See the{" "}
          <Link
            href="/docs/deployment"
            className="font-medium text-primary hover:underline"
          >
            Deployment
          </Link>{" "}
          guide when you are ready to ship, or check the{" "}
          <Link
            href="/docs/changelog"
            className="font-medium text-primary hover:underline"
          >
            Changelog
          </Link>{" "}
          for the full release history.
        </p>
      </section>
    </div>
  );
}
