"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { LazyChart } from "@dashboardpack/core/components/shared/lazy-chart";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  skillsData,
  deviceUsageData,
  budgetData,
  q1ScatterData,
  q2ScatterData,
  comboData,
} from "@dashboardpack/core/lib/data";

// ── Tooltip Components ──

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  unit?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; unit?: string }[];
}) {
  if (!active || !payload?.length) return null;
  const x = payload.find((p) => p.name === "Spend");
  const y = payload.find((p) => p.name === "Revenue");
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-sm">
        <span className="text-muted-foreground">Spend:</span>{" "}
        <span className="font-semibold">
          ${((x?.value ?? 0) / 1000).toFixed(1)}k
        </span>
      </p>
      <p className="text-sm">
        <span className="text-muted-foreground">Revenue:</span>{" "}
        <span className="font-semibold">
          ${((y?.value ?? 0) / 1000).toFixed(1)}k
        </span>
      </p>
    </div>
  );
}

function TreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; size: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{item.name}</p>
      <p className="text-sm font-semibold">
        ${(item.size / 1000).toFixed(0)}k
      </p>
    </div>
  );
}

function ComboTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}:{" "}
          {entry.name === "Revenue"
            ? `$${(entry.value / 1000).toFixed(0)}k`
            : entry.name === "Growth %"
              ? `${entry.value}%`
              : entry.value}
        </p>
      ))}
    </div>
  );
}

// ── Custom Treemap Content ──

function CustomTreemapContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  fill?: string;
  depth?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, size, fill, depth } = props;

  if (depth !== 1) return null;

  const showLabel = width > 50 && height > 30;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="var(--background)"
        strokeWidth={2}
        rx={4}
        opacity={0.85}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-medium"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/70 text-[10px]"
          >
            ${((size ?? 0) / 1000).toFixed(0)}k
          </text>
        </>
      )}
    </g>
  );
}

// ── Page ──

export default function ChartsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Charts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore different chart types available in the dashboard.
        </p>
      </div>

      {/* Row 1: Radar + Radial Bar */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Team Skills Assessment
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Current vs previous quarter competencies
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
                <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Radar
                  name="Previous"
                  dataKey="previous"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{
                    color: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radial Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Device Usage
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Session distribution by device type
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center gap-4">
              <div className="h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="25%"
                    outerRadius="90%"
                    data={deviceUsageData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      background={{ fill: "var(--muted)", opacity: 0.3 }}
                      cornerRadius={6}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const item = payload[0].payload as {
                          name: string;
                          value: number;
                        };
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
                            <p className="text-xs font-medium text-muted-foreground">
                              {item.name}
                            </p>
                            <p className="text-sm font-semibold">
                              {item.value}%
                            </p>
                          </div>
                        );
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3">
                {deviceUsageData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Scatter + Treemap */}
      <LazyChart height={400} className="mt-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Scatter Chart */}
        <Card className="xl:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Marketing Spend vs Revenue
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Campaign performance comparison by quarter
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Spend"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Revenue"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip content={<ScatterTooltip />} />
                <Legend
                  wrapperStyle={{
                    color: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
                <Scatter
                  name="Q1 Campaigns"
                  data={q1ScatterData}
                  fill="var(--chart-1)"
                  opacity={0.7}
                />
                <Scatter
                  name="Q2 Campaigns"
                  data={q2ScatterData}
                  fill="var(--chart-3)"
                  opacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Treemap */}
        <Card className="xl:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Budget Allocation
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Department spending distribution
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <Treemap
                data={budgetData}
                dataKey="size"
                nameKey="name"
                content={<CustomTreemapContent />}
              >
                <Tooltip content={<TreemapTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      </LazyChart>

      {/* Row 3: Composed/Mixed Chart */}
      <LazyChart height={440} className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Requests &amp; Latency Trend
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Combined view of requests (area), latency (bars), and growth rate
              (line)
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={comboData}>
                <defs>
                  <linearGradient
                    id="comboRevGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  dx={-8}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  dx={8}
                />
                <Tooltip content={<ComboTooltip />} />
                <Legend
                  wrapperStyle={{
                    color: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#comboRevGrad)"
                  dot={false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Requests"
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  opacity={0.8}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  name="Growth %"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </LazyChart>
    </>
  );
}
