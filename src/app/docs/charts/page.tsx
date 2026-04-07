import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

export default function ChartsDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Charts</h1>
        <p className="text-sm text-muted-foreground">
          A guide to the chart types available in Signal Dashboard, all powered by
          Recharts with zero additional dependencies.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Signal Dashboard uses{" "}
          <strong className="text-foreground">Recharts</strong> for all data
          visualization. Charts are embedded across the 5 dashboard variations
          and showcased on the dedicated{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            /charts
          </code>{" "}
          page. All charts respect the OKLCh color tokens and work seamlessly in
          both light and dark modes.
        </p>
      </section>

      {/* Chart Types */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Available Chart Types</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-start font-medium">Type</th>
                <th className="px-4 py-2 text-start font-medium">
                  Component
                </th>
                <th className="px-4 py-2 text-start font-medium">Used In</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Area</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  AreaChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Dashboard, Servers, Containers, Kubernetes
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Bar</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  BarChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Dashboard, Analytics, Deployments, Incidents
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Line</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  LineChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">Analytics</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Pie / Donut</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  PieChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Dashboard, Servers, Uptime, Kubernetes
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Sparkline</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  AreaChart (mini)
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Stats cards across all dashboards
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Radar</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  RadarChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Charts page
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Radial Bar / Gauge</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  RadialBarChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Charts page
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Treemap</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  Treemap
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Charts page
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Scatter / Bubble</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  ScatterChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Charts page
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Composed / Mixed</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  ComposedChart
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  Charts page
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Chart Colors */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chart Color Palette</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Five chart colors are defined as CSS custom properties in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            globals.css
          </code>
          , with separate values for light and dark modes. Use them with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--chart-1)
          </code>{" "}
          through{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--chart-5)
          </code>{" "}
          in chart fills and strokes. Tailwind classes like{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            bg-chart-1
          </code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            text-chart-1
          </code>{" "}
          are also available for legends and badges.
        </p>
      </section>

      {/* Common Patterns */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Common Patterns</h2>

        <h3 className="text-sm font-medium">ResponsiveContainer</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every chart is wrapped in a Recharts{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            ResponsiveContainer
          </code>{" "}
          for automatic width adaptation. Standard heights are 320px for main
          charts, 48px for sparklines, and 176px diameter for donut charts.
        </p>

        <h3 className="text-sm font-medium">Custom Tooltips</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All charts use custom tooltip components styled to match the design
          system:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            rounded-lg border border-border bg-popover px-3 py-2 shadow-xl
          </code>
          . This ensures consistent look in both light and dark modes.
        </p>

        <h3 className="text-sm font-medium">Axis Configuration</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Axes hide their lines and ticks (
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            axisLine=&#123;false&#125; tickLine=&#123;false&#125;
          </code>
          ) and use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--muted-foreground)
          </code>{" "}
          for label color. Grid lines use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--border)
          </code>{" "}
          with dashed strokes and horizontal-only display.
        </p>

        <h3 className="text-sm font-medium">Gradient Fills</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Area charts use SVG{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            linearGradient
          </code>{" "}
          definitions that fade from 25% opacity at the top to 0% at the
          bottom, creating a clean filled area effect.
        </p>
      </section>

      {/* Adding a Chart */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding a New Chart</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To add a chart to any page, import the components from{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            recharts
          </code>{" "}
          and wrap them in a Card:
        </p>
        <CodeBlock code={`import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@dashboardpack/core/components/ui/card";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
];

export function MyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}
              stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}`} />
      </section>

      {/* Mock Data */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chart Data</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All chart data lives in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/data/
          </code>
          . Analytics data is in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            analytics.ts
          </code>{" "}
          and charts showcase data is in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            charts.ts
          </code>
          . Types are defined in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            types.ts
          </code>{" "}
          and re-exported from{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/lib/data/index.ts
          </code>
          . Dashboard variation pages (Servers, Containers, Kubernetes) define their chart
          data inline within the page component.
        </p>
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Learn about the{" "}
          <Link
            href="/docs/testing"
            className="font-medium text-primary hover:underline"
          >
            Testing
          </Link>{" "}
          setup, or see the{" "}
          <Link
            href="/docs/theming"
            className="font-medium text-primary hover:underline"
          >
            Theming
          </Link>{" "}
          guide to customize chart colors.
        </p>
      </section>
    </div>
  );
}
