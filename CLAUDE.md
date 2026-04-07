# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev       # Start dev server (Next.js hot reload)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint (flat config, v9)
```

```bash
npm run test      # Vitest watch mode
npm run test:run  # Vitest single run
npm run test:e2e  # Playwright E2E tests
npm run storybook # Storybook dev server (port 6006)
npm run analyze   # Bundle size analysis (opens report)
```

## Architecture

Next.js 16 app using the App Router with React 19, TypeScript, and Tailwind CSS v4. All dashboard components are client-side rendered (`"use client"`). No backend/API layer — data is mock/hardcoded within components.

### Key Layout

`src/app/page.tsx` composes the full dashboard from these components:

- **Sidebar** (`src/components/dashboard/sidebar.tsx`) — fixed left nav, collapsible
- **Header** (`src/components/dashboard/header.tsx`) — search, theme toggle, notifications
- **StatsCards** — 4-column metric cards with trend indicators
- **RevenueChart** — Recharts area/bar chart with tab switching
- **SidePanel** — traffic pie chart + goals progress bars
- **RecentOrders** — data table
- **ActivityFeed** — timeline

The main content area is offset by the sidebar width (`ml-[260px]`).

### UI Component System

UI primitives in `src/components/ui/` follow shadcn/ui conventions (CVA variants, `cn()` utility, `forwardRef` pattern) but are vendored source code — there is no `@shadcn/ui` package dependency. A `components.json` config exists so `npx shadcn@latest add <component>` can be used to scaffold new components.

### Theming

Custom `ThemeProvider` in `src/components/theme-provider.tsx` manages dark/light/system modes via React Context + `classList` toggling on `<html>`. Dark mode variant is defined as `@custom-variant dark (&:is(.dark *))` in globals.css.

Colors use **OKLCh** format defined as CSS custom properties in `src/app/globals.css` with separate `:root` (light) and `.dark` blocks. Semantic tokens: `--primary`, `--card`, `--muted`, `--sidebar-*`, `--chart-1` through `--chart-5`, `--success`, `--warning`, `--destructive`.

### Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json). All imports use this alias.

### Key Libraries

- **Recharts** for all charts (area, bar, pie)
- **Lucide React** for icons
- **class-variance-authority** for component variants
- **clsx + tailwind-merge** wrapped in `cn()` utility at `src/lib/utils.ts`

### i18n

Custom i18n system in `src/lib/i18n/` using React Context + localStorage persistence. Three locales: en, de, fr. Translation JSON files in `src/lib/i18n/messages/`. Type-safe keys via `useTranslations()` hook from `src/lib/i18n/locale-context.tsx`.

### Storybook

Storybook 8.x using `@storybook/react-vite` framework (NOT `@storybook/nextjs` -- incompatible with Next.js 16). Config in `.storybook/`. Stories co-located with components as `*.stories.tsx`.

### Performance

Chart-heavy components on the dashboard use `next/dynamic` with `ssr: false`. The `LazyChart` wrapper (`src/components/shared/lazy-chart.tsx`) uses IntersectionObserver to defer rendering until the element enters the viewport.
