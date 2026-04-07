import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function DeploymentPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Deploy to Production
        </h1>
        <p className="text-sm text-muted-foreground">
          How to deploy Signal Dashboard to Vercel, a self-hosted server, or
          Docker.
        </p>
      </div>

      {/* Vercel */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Vercel (Recommended)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vercel is the easiest way to deploy a Next.js application. It provides
          automatic builds, preview deployments, and a global edge network.
        </p>
        <ol className="list-decimal space-y-2 ps-6 text-sm text-muted-foreground">
          <li>
            Push your code to a GitHub, GitLab, or Bitbucket repository.
          </li>
          <li>
            Go to{" "}
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              vercel.com/new
            </a>{" "}
            and import your repository.
          </li>
          <li>
            Vercel auto-detects Next.js &mdash; accept the defaults and click
            &quot;Deploy&quot;.
          </li>
          <li>
            Every push to the main branch triggers a production deployment.
            Pull requests get preview URLs automatically.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          No build configuration is needed. Vercel handles{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            npm run build
          </code>{" "}
          and serves the output from their global CDN.
        </p>
      </section>

      {/* Self-hosted */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Self-Hosted (Node.js)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You can run the production build on any server with Node.js 18+
          installed.
        </p>
        <CodeBlock code={`# Build the application
npm run build

# Start the production server
npm run start

# The server runs on port 3000 by default.
# Use the PORT environment variable to change it:
PORT=8080 npm run start`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          For production, use a process manager like{" "}
          <strong className="text-foreground">PM2</strong> to keep the server
          running and handle restarts:
        </p>
        <CodeBlock code={`npm install -g pm2
pm2 start npm --name "signal-dashboard" -- start
pm2 save`} />
      </section>

      {/* Docker */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Docker</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            Dockerfile
          </code>{" "}
          at the project root for containerized deployments:
        </p>
        <CodeBlock code={`FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Build and run the container:
        </p>
        <CodeBlock code={`docker build -t signal-dashboard .
docker run -p 3000:3000 signal-dashboard`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Note:</strong> For the standalone
          output to work, add{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            output: &quot;standalone&quot;
          </code>{" "}
          to your{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            next.config.ts
          </code>
          .
        </p>
      </section>

      {/* Environment variables */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Environment Variables</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Signal Dashboard currently uses no required environment variables since
          all data is mock/hardcoded. When you connect a real backend, you will
          typically need:
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">Variable</th>
                <th className="px-4 py-2 text-start font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  NEXT_PUBLIC_API_URL
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Base URL for your API (accessible in browser)
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">DATABASE_URL</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Database connection string (server-only)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">
                  NEXTAUTH_SECRET
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Auth secret for NextAuth.js (if using auth)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .env.local
          </code>{" "}
          file at the project root for local development. Never commit this
          file to version control.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Check the{" "}
          <Link
            href="/docs/changelog"
            className="font-medium text-primary hover:underline"
          >
            Changelog
          </Link>{" "}
          for the latest updates and release notes.
        </p>
      </section>
    </div>
  );
}
