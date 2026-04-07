import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function I18nDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Internationalization (i18n)</h1>
        <p className="text-sm text-muted-foreground">
          Built-in locale system with English, German, and French translations,
          localStorage persistence, and easy extensibility.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Signal Dashboard includes a lightweight i18n system built on React
          Context. It stores the active locale in localStorage (matching the
          pattern used for theme, density, and layout preferences) and provides
          a type-safe{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useTranslations()
          </code>{" "}
          hook for accessing translation strings.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This approach was chosen over URL-based i18n libraries (like
          next-intl) because the project uses Next.js static export (
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            output: &quot;export&quot;
          </code>
          ), which is incompatible with middleware-based locale routing.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Architecture</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">File</th>
                <th className="px-4 py-2 text-start font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/i18n/config.ts
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Locale list, default locale, message loader
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/i18n/locale-context.tsx
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  LocaleProvider, useLocale(), useTranslations() hooks
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/i18n/messages/en.json
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  English translations (~80 keys)
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/i18n/messages/de.json
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  German translations
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">
                  src/lib/i18n/messages/fr.json
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  French translations
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Using Translations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Import the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useTranslations
          </code>{" "}
          hook and call it with a dot-notation key:
        </p>
        <CodeBlock code={`"use client";

import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

export default function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome")}</p>
    </div>
  );
}`} />
      </section>

      {/* Translated areas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Translated Areas</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The following areas are translated out of the box as examples:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Sidebar</strong> &mdash; All
            navigation group labels and item labels
          </li>
          <li>
            <strong className="text-foreground">Header</strong> &mdash; Search
            placeholder, button labels, user menu items, notification text
          </li>
          <li>
            <strong className="text-foreground">Dashboard Home</strong> &mdash;
            Welcome message, page title
          </li>
          <li>
            <strong className="text-foreground">Common</strong> &mdash; Action
            labels (Save, Cancel, Delete, Edit, Search), filter labels
          </li>
        </ul>
      </section>

      {/* Adding a new locale */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding a New Locale</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To add a new language (e.g., Spanish):
        </p>
        <ol className="list-decimal space-y-2 ps-6 text-sm text-muted-foreground">
          <li>
            Copy{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/lib/i18n/messages/en.json
            </code>{" "}
            to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              es.json
            </code>{" "}
            and translate the values
          </li>
          <li>
            Add the locale to the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              locales
            </code>{" "}
            array in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
              src/lib/i18n/config.ts
            </code>
            :
          </li>
        </ol>
        <CodeBlock code={`export const locales = [
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "de", label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "fr", label: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "es", label: "Espa\u00F1ol", flag: "\u{1F1EA}\u{1F1F8}" },  // Add this
] as const;`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The locale switcher in Settings and Theme Customizer will
          automatically show the new option.
        </p>
      </section>

      {/* Adding translation keys */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding Translation Keys</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add new keys to all JSON message files. Keys use dot-notation
          organized by feature area:
        </p>
        <CodeBlock code={`// en.json
{
  "reports": {
    "title": "Reports",
    "export": "Export PDF",
    "noData": "No reports found."
  }
}

// de.json
{
  "reports": {
    "title": "Berichte",
    "export": "PDF exportieren",
    "noData": "Keine Berichte gefunden."
  }
}`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useTranslations
          </code>{" "}
          hook is type-safe &mdash; TypeScript will autocomplete valid keys and
          warn about missing ones thanks to the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            NestedKeyOf
          </code>{" "}
          utility type.
        </p>
      </section>

      {/* Locale switcher */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Locale Switcher</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The locale can be switched from two places:
        </p>
        <ul className="list-disc space-y-1 ps-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Settings page</strong> &mdash;
            Appearance tab &rarr; Language section
          </li>
          <li>
            <strong className="text-foreground">Theme Customizer</strong>{" "}
            &mdash; Language section (below Direction)
          </li>
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Both use the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            useLocale()
          </code>{" "}
          hook which provides{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            locale
          </code>{" "}
          (current value) and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            setLocale()
          </code>{" "}
          (setter that persists to localStorage).
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Learn how to{" "}
          <Link
            href="/docs/adding-pages"
            className="font-medium text-primary hover:underline"
          >
            add new pages
          </Link>{" "}
          with translation support, or browse the{" "}
          <Link
            href="/docs/components"
            className="font-medium text-primary hover:underline"
          >
            Components
          </Link>{" "}
          reference.
        </p>
      </section>
    </div>
  );
}
