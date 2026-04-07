import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function ThemingPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="text-sm text-muted-foreground">
          Learn how the color system works and how to customize the look and
          feel of Signal Dashboard.
        </p>
      </div>

      {/* OKLCh Color Tokens */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">OKLCh Color Tokens</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All colors are defined as CSS custom properties using the{" "}
          <strong className="text-foreground">OKLCh</strong> color space. OKLCh
          provides perceptually uniform lightness, making it easier to create
          consistent color palettes. The tokens are defined in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/app/globals.css
          </code>
          .
        </p>
        <CodeBlock code={`:root {
  --primary: oklch(0.55 0.175 160);
  --primary-foreground: oklch(0.985 0.002 230);
  --background: oklch(0.985 0.002 230);
  --foreground: oklch(0.155 0.015 230);
  --card: oklch(1 0 0);
  --muted: oklch(0.96 0.005 230);
  --muted-foreground: oklch(0.556 0.015 230);
  --border: oklch(0.922 0.005 230);
  /* ... more tokens */
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The OKLCh format is{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            oklch(lightness chroma hue)
          </code>{" "}
          where lightness is 0&ndash;1, chroma is 0&ndash;0.4, and hue is
          0&ndash;360 degrees. Tailwind CSS v4 maps these tokens through the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            @theme inline
          </code>{" "}
          block at the top of globals.css.
        </p>
      </section>

      {/* Changing the primary color */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Changing the Primary Color</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To change the primary color, update the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            --primary
          </code>{" "}
          token in both the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            :root
          </code>{" "}
          (light) and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .dark
          </code>{" "}
          blocks. For example, to switch from teal to blue:
        </p>
        <CodeBlock code={`/* Light mode */
:root {
  --primary: oklch(0.55 0.175 250);          /* hue 160 → 250 (blue) */
  --primary-foreground: oklch(0.985 0.002 230);
  --ring: oklch(0.55 0.175 250);
}

/* Dark mode */
.dark {
  --primary: oklch(0.65 0.19 250);
  --primary-foreground: oklch(0.09 0.015 170);
  --ring: oklch(0.65 0.19 250);
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The change propagates everywhere{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            bg-primary
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            text-primary
          </code>
          , or{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            ring-primary
          </code>{" "}
          is used &mdash; buttons, links, active states, charts, and sidebar
          accents all update automatically.
        </p>
      </section>

      {/* Semantic tokens */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Semantic Color Tokens</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The design system uses semantic names rather than raw color values.
          Each token has a foreground counterpart for text that sits on top of
          it:
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">Token</th>
                <th className="px-4 py-2 text-start font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--primary</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Brand color, buttons, active states
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--secondary</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Secondary actions, subtle backgrounds
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--muted</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Muted backgrounds, code blocks
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--accent</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Hover states, highlights
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--destructive</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Error states, delete actions
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--success</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Success indicators, positive trends
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">--warning</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Warning badges, caution states
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  --chart-1 to --chart-5
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Chart color palette (5 colors)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">--sidebar-*</td>
                <td className="px-4 py-2 text-muted-foreground">
                  Sidebar-specific tokens (dark sidebar in light mode)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dark mode */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Dark Mode</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Dark mode is implemented by toggling a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .dark
          </code>{" "}
          class on the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            &lt;html&gt;
          </code>{" "}
          element. The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            ThemeProvider
          </code>{" "}
          component in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/components/theme-provider.tsx
          </code>{" "}
          manages the state and persists the preference to localStorage. The
          Tailwind dark variant is configured in globals.css:
        </p>
        <CodeBlock code={`@custom-variant dark (&:is(.dark *));`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          This allows you to use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            dark:bg-slate-900
          </code>{" "}
          classes in your components, and the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            .dark
          </code>{" "}
          block in globals.css overrides all semantic tokens for dark mode.
        </p>
      </section>

      {/* Using the theme provider */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Using the Theme Provider</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useTheme
          </code>{" "}
          hook provides access to the current theme and a setter:
        </p>
        <CodeBlock code={`"use client";

import { useTheme } from "@dashboardpack/core/providers/theme-provider";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current theme: {theme}
    </button>
  );
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Supported values are{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            &quot;light&quot;
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            &quot;dark&quot;
          </code>
          , and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            &quot;system&quot;
          </code>
          . The system option follows the user&apos;s OS preference and reacts
          to changes in real time.
        </p>
      </section>

      {/* Theme Customizer */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Theme Customizer</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Signal Dashboard includes a live Theme Customizer accessible via the
          palette icon in the header. It opens as a slide-out drawer panel where
          you can preview every change in real time without refreshing the page.
          The Customizer controls the following settings:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Color Presets</strong>{" "}
              &mdash; 6 built-in palettes: Default (Teal), Ocean, Sunset,
              Forest, Berry, and Slate. Each preset swaps the full set of OKLCh
              tokens at runtime, instantly recoloring every component, chart, and
              sidebar accent across the entire dashboard.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Density</strong>{" "}
              &mdash; Three levels: Compact, Default, and Comfortable. Adjusts
              spacing, padding, and font sizes globally via CSS custom
              properties, letting you fit more data on screen or give content
              room to breathe.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Layout</strong>{" "}
              &mdash; Choose between the default Sidebar layout (fixed left
              navigation) or a Horizontal Top-Nav layout where the main
              navigation runs across the top of the page.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Container</strong>{" "}
              &mdash; Fluid (full-width, edge-to-edge content) or Boxed
              (max-width centered container with side margins for a more
              traditional feel).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Direction</strong>{" "}
              &mdash; Toggle between LTR (left-to-right) and RTL
              (right-to-left) text direction for multilingual support.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Reset</strong>{" "}
              &mdash; A single button that restores all settings to their
              defaults (Default Teal preset, Default density, Sidebar layout,
              Fluid container, LTR direction).
            </span>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All preferences are persisted to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            localStorage
          </code>
          , so they survive page refreshes and browser restarts. The next time
          the user visits the dashboard, their chosen color preset, density,
          layout, container, and direction settings are restored automatically.
        </p>
      </section>

      {/* RTL Support */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">RTL Support</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The entire dashboard supports right-to-left text direction for
          languages such as Arabic, Hebrew, Persian, and Urdu. The toggle is
          available in the Theme Customizer under the Direction setting. When RTL
          is enabled, the sidebar moves to the right, text aligns to the right,
          and all directional spacing flips accordingly.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The implementation relies on the following techniques:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">CSS Logical Properties</strong>{" "}
              &mdash; Instead of physical{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                ml-*
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                mr-*
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                pl-*
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                pr-*
              </code>
              , all spacing uses logical equivalents:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                ms-*
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                me-*
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                ps-*
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                pe-*
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                text-start
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                text-end
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                border-s
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                border-e
              </code>
              , and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                rounded-s
              </code>
              /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                rounded-e
              </code>
              . These automatically flip based on the document direction.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Tailwind CSS v4 ltr:/rtl: Variants</strong>{" "}
              &mdash; For cases where logical properties alone are not
              sufficient (e.g., icon rotation, absolute positioning, transform
              origins), Tailwind&apos;s{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                ltr:
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                rtl:
              </code>{" "}
              variants apply direction-specific styles conditionally.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">dir attribute on HTML element</strong>{" "}
              &mdash; The Theme Customizer sets{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                dir=&quot;rtl&quot;
              </code>{" "}
              on the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                &lt;html&gt;
              </code>{" "}
              element, which browsers use natively to reverse text flow, scroll
              direction, and table column order.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">Inline Script Prevents Flash</strong>{" "}
              &mdash; A small inline script in the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                &lt;head&gt;
              </code>{" "}
              reads the saved direction preference from localStorage and applies
              the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                dir
              </code>{" "}
              attribute before the page renders. This prevents a flash of
              incorrect direction (FOID) on page load, similar to how the theme
              script prevents a flash of incorrect theme.
            </span>
          </li>
        </ul>
        <CodeBlock code={`<!-- Example: classes that work in both LTR and RTL -->
<div className="ms-4 me-2 ps-3 pe-3 text-start border-s-2">
  Content flows correctly in both directions
</div>

<!-- Example: direction-specific overrides -->
<ChevronRight className="size-4 ltr:rotate-0 rtl:rotate-180" />`} />
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          See{" "}
          <Link
            href="/docs/components"
            className="font-medium text-primary hover:underline"
          >
            Components
          </Link>{" "}
          for a full list of available UI primitives, or learn how to{" "}
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
