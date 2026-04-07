import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="text-sm text-muted-foreground">
          Step-by-step guide to getting Signal Dashboard running on your local
          machine.
        </p>
      </div>

      {/* Prerequisites */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Prerequisites</h2>
        <p className="text-sm text-muted-foreground">
          Before you begin, make sure you have the following installed:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Node.js 18+</strong> &mdash;{" "}
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download Node.js
            </a>
          </li>
          <li>
            <strong className="text-foreground">npm</strong>,{" "}
            <strong className="text-foreground">yarn</strong>, or{" "}
            <strong className="text-foreground">pnpm</strong> &mdash; npm ships
            with Node.js; yarn and pnpm are optional alternatives
          </li>
          <li>
            <strong className="text-foreground">Git</strong> &mdash; for cloning
            the repository
          </li>
        </ul>
      </section>

      {/* Step 1: Clone */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Step 1: Clone the Repository</h2>
        <CodeBlock code={`git clone https://github.com/colorlib/signal-dashboard.git
cd signal-dashboard`} />
      </section>

      {/* Step 2: Install dependencies */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Step 2: Install Dependencies</h2>
        <p className="text-sm text-muted-foreground">
          Use your preferred package manager:
        </p>

        <h3 className="text-sm font-medium">npm</h3>
        <CodeBlock code={`npm install`} />

        <h3 className="text-sm font-medium">yarn</h3>
        <CodeBlock code={`yarn`} />

        <h3 className="text-sm font-medium">pnpm</h3>
        <CodeBlock code={`pnpm install`} />
      </section>

      {/* Step 3: Run dev server */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Step 3: Run the Dev Server</h2>
        <CodeBlock code={`npm run dev`} />
        <p className="text-sm text-muted-foreground">
          The development server starts at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            http://localhost:3737
          </code>
          . Next.js hot-reloads your changes automatically so you can see
          updates in real time.
        </p>
      </section>

      {/* Step 4: Build for production */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Step 4: Build for Production
        </h2>
        <p className="text-sm text-muted-foreground">
          When you are ready to deploy, create an optimized production build:
        </p>
        <CodeBlock code={`npm run build
npm run start`} />
        <p className="text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            npm run build
          </code>{" "}
          compiles and optimizes the application.{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            npm run start
          </code>{" "}
          serves the built output on port 3000.
        </p>
      </section>

      {/* Available scripts */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Available Scripts</h2>
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
                  <code className="text-xs font-mono">npm run dev</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Start development server with hot reload
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run build</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Create optimized production build
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run start</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Serve the production build
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run lint</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run ESLint across the project
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run Vitest unit tests in watch mode
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test:run</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run Vitest unit tests once (CI-friendly)
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
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run test:e2e:ui</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Open Playwright interactive UI mode
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run storybook</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Launch Storybook component browser on port 6006
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run build-storybook</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Build static Storybook for deployment
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <code className="text-xs font-mono">npm run analyze</code>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Run production build with bundle analyzer report
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Seed / Starter Version */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Seed / Starter Version</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you prefer a clean starting point without demo pages and mock data,
          use the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            seed/
          </code>{" "}
          directory. It includes all infrastructure (theming, i18n, layouts, 33
          UI components, Storybook and Vitest configs) with just two routes:
          Dashboard and Settings.
        </p>
        <CodeBlock code={`cd seed
npm install
npm run dev`} />
        <p className="text-sm text-muted-foreground">
          See the{" "}
          <Link
            href="/docs/seed-starter"
            className="font-medium text-primary hover:underline"
          >
            Seed/Starter Guide
          </Link>{" "}
          for complete details.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Now that you have the project running, explore the{" "}
          <Link
            href="/docs/folder-structure"
            className="font-medium text-primary hover:underline"
          >
            Folder Structure
          </Link>{" "}
          to understand how the codebase is organized.
        </p>
      </section>
    </div>
  );
}
