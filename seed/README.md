# Signal Dashboard — Starter Template

A minimal starting point built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. All infrastructure is included — theming, i18n, layouts, command palette — so you can focus on building your pages.

## What's Included

- Sidebar + Header + Top-Nav layout with collapsible navigation
- Theme Customizer: 6 color presets, 3 density levels, dark/light/system, RTL
- i18n: English, German, French with type-safe translation keys
- Command Palette (Cmd+K / Ctrl+K)
- 33 vendored shadcn/ui components
- Settings page with appearance customization
- Storybook config (add stories as you build components)
- Vitest + Playwright configs (add tests as you build)
- Bundle analyzer (`npm run analyze`)
- Framer Motion page transitions
- Accessible: skip-to-content, ARIA attributes, semantic HTML

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3737](http://localhost:3737)

## Adding Pages

1. Create `src/app/(dashboard)/your-page/page.tsx`
2. Add nav entry in `src/components/dashboard/sidebar.tsx`
3. Add to `src/lib/navigation.ts` for Cmd+K search
4. (Optional) Add translation keys in `src/lib/i18n/messages/*.json`

## Adding Components

```bash
npx shadcn@latest add accordion
```

Components are scaffolded into `src/components/ui/` as vendored source code.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (port 3737) |
| `npm run build` | Production build (static export to `out/`) |
| `npm run lint` | ESLint |
| `npm run storybook` | Storybook dev server (port 6006) |
| `npm run analyze` | Bundle size analysis |

## Project Structure

```text
src/
├── app/
│   ├── (dashboard)/          # Dashboard layout
│   │   ├── page.tsx          # Starter dashboard
│   │   └── settings/         # Settings with appearance tab
│   ├── globals.css           # OKLCh color tokens
│   └── layout.tsx            # Root layout
├── components/
│   ├── dashboard/            # Sidebar, Header, TopNav, Customizer
│   ├── shared/               # PageHeader, EmptyState, LazyChart
│   └── ui/                   # 33 shadcn/ui primitives
└── lib/
    ├── i18n/                 # Locale config, provider, messages
    ├── navigation.ts         # Command palette routes
    └── utils.ts              # cn() utility
```

## Theming

Colors use OKLCh format in `src/app/globals.css`. Change the primary hue:

```css
:root {
  --primary: oklch(0.55 0.19 160);  /* Change 160 to your hue */
}
```

Or use the Theme Customizer (palette icon in header).

## License

MIT
