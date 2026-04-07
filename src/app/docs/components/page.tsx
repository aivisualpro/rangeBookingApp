import Link from "next/link";
import { CodeBlock } from "@dashboardpack/core/components/docs/code-block";

interface ComponentEntry {
  name: string;
  description: string;
  importPath: string;
}

interface ComponentGroup {
  title: string;
  items: ComponentEntry[];
}

const componentGroups: ComponentGroup[] = [
  {
    title: "Layout",
    items: [
      {
        name: "Card",
        description:
          "Container with header, content, and footer slots. Used for stats, forms, and data panels.",
        importPath: "@dashboardpack/core/components/ui/card",
      },
      {
        name: "Separator",
        description: "Horizontal or vertical divider line between sections.",
        importPath: "@dashboardpack/core/components/ui/separator",
      },
      {
        name: "Sheet",
        description:
          "Slide-out panel from any edge. Used for mobile menus and detail views.",
        importPath: "@dashboardpack/core/components/ui/sheet",
      },
      {
        name: "Accordion",
        description:
          "Vertically stacked set of collapsible sections. Supports single or multiple open items.",
        importPath: "@dashboardpack/core/components/ui/accordion",
      },
      {
        name: "Collapsible",
        description:
          "Expandable/collapsible content area with trigger control.",
        importPath: "@dashboardpack/core/components/ui/collapsible",
      },
      {
        name: "Resizable",
        description:
          "Resizable panel layout with draggable handles for adjusting pane sizes.",
        importPath: "@dashboardpack/core/components/ui/resizable",
      },
      {
        name: "Scroll Area",
        description:
          "Custom scrollable container with styled scrollbars for overflow content.",
        importPath: "@dashboardpack/core/components/ui/scroll-area",
      },
    ],
  },
  {
    title: "Form",
    items: [
      {
        name: "Input",
        description:
          "Text input field with consistent border and focus ring styling.",
        importPath: "@dashboardpack/core/components/ui/input",
      },
      {
        name: "Select",
        description:
          "Dropdown select menu built on Radix UI Select primitive.",
        importPath: "@dashboardpack/core/components/ui/select",
      },
      {
        name: "Textarea",
        description: "Multi-line text input with auto-sizing support.",
        importPath: "@dashboardpack/core/components/ui/textarea",
      },
      {
        name: "Checkbox",
        description:
          "Boolean toggle with checkmark indicator. Supports indeterminate state.",
        importPath: "@dashboardpack/core/components/ui/checkbox",
      },
      {
        name: "Switch",
        description: "Toggle switch for on/off boolean states.",
        importPath: "@dashboardpack/core/components/ui/switch",
      },
      {
        name: "Label",
        description:
          "Accessible label element that pairs with form inputs.",
        importPath: "@dashboardpack/core/components/ui/label",
      },
      {
        name: "Radio Group",
        description:
          "Group of radio buttons for single-select from multiple options.",
        importPath: "@dashboardpack/core/components/ui/radio-group",
      },
      {
        name: "Form",
        description:
          "React Hook Form integration with Zod validation and accessible error messages.",
        importPath: "@dashboardpack/core/components/ui/form",
      },
      {
        name: "Combobox",
        description:
          "Searchable autocomplete input combining a text field with a filtered dropdown list.",
        importPath: "@dashboardpack/core/components/ui/combobox",
      },
      {
        name: "Date Picker",
        description:
          "Calendar-based date selection input with popover display.",
        importPath: "@dashboardpack/core/components/ui/date-picker",
      },
      {
        name: "Multi-Select",
        description:
          "Select multiple values from a dropdown with tag-style display of selections.",
        importPath: "@dashboardpack/core/components/ui/multi-select",
      },
      {
        name: "Phone Input",
        description:
          "International phone number input with country code selector and formatting.",
        importPath: "@dashboardpack/core/components/ui/phone-input",
      },
      {
        name: "OTP Input",
        description:
          "One-time password input with individual digit fields and auto-advance.",
        importPath: "@dashboardpack/core/components/ui/otp-input",
      },
      {
        name: "Color Picker",
        description:
          "Visual color selection input with hue/saturation controls and hex value entry.",
        importPath: "@dashboardpack/core/components/ui/color-picker",
      },
      {
        name: "File Uploader (Dropzone)",
        description:
          "Drag-and-drop file upload area built with react-dropzone. Supports file type and size validation.",
        importPath: "@dashboardpack/core/components/ui/file-uploader",
      },
      {
        name: "Slider",
        description:
          "Range input for selecting a numeric value within a min/max range. Supports single and dual thumbs.",
        importPath: "@dashboardpack/core/components/ui/slider",
      },
    ],
  },
  {
    title: "Data Display",
    items: [
      {
        name: "Badge",
        description:
          "Small status label with color variants: default, secondary, destructive, success, warning, outline.",
        importPath: "@dashboardpack/core/components/ui/badge",
      },
      {
        name: "Table",
        description:
          "HTML table primitives (Table, TableHeader, TableBody, TableRow, TableCell) with consistent styling.",
        importPath: "@dashboardpack/core/components/ui/table",
      },
      {
        name: "Avatar",
        description:
          "User avatar with image and fallback initials support.",
        importPath: "@dashboardpack/core/components/ui/avatar",
      },
      {
        name: "Progress",
        description: "Horizontal progress bar with animated fill.",
        importPath: "@dashboardpack/core/components/ui/progress",
      },
      {
        name: "Skeleton",
        description:
          "Loading placeholder with pulse animation for content that is still loading.",
        importPath: "@dashboardpack/core/components/ui/skeleton",
      },
      {
        name: "Calendar",
        description:
          "Monthly calendar view for date display, selection, and event management.",
        importPath: "@dashboardpack/core/components/ui/calendar",
      },
      {
        name: "Carousel",
        description:
          "Horizontal content slider with navigation arrows and indicator dots.",
        importPath: "@dashboardpack/core/components/ui/carousel",
      },
      {
        name: "Chart",
        description:
          "Recharts wrapper with theme-aware colors and consistent tooltip/legend styling.",
        importPath: "@dashboardpack/core/components/ui/chart",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        name: "Dialog",
        description:
          "Modal dialog with overlay, title, description, and action buttons.",
        importPath: "@dashboardpack/core/components/ui/dialog",
      },
      {
        name: "Tooltip",
        description:
          "Popup hint that appears on hover or focus. Positioned automatically.",
        importPath: "@dashboardpack/core/components/ui/tooltip",
      },
      {
        name: "Sonner (Toast)",
        description:
          "Toast notification system. Trigger with toast() from the sonner package.",
        importPath: "@dashboardpack/core/components/ui/sonner",
      },
      {
        name: "Popover",
        description:
          "Floating content panel triggered by a button click. Used for filters and mini-forms.",
        importPath: "@dashboardpack/core/components/ui/popover",
      },
      {
        name: "Alert",
        description:
          "Callout banner for important messages with icon, title, and description. Supports info, success, warning, and destructive variants.",
        importPath: "@dashboardpack/core/components/ui/alert",
      },
    ],
  },
  {
    title: "Navigation",
    items: [
      {
        name: "Breadcrumb",
        description:
          "Trail of links showing the current page hierarchy.",
        importPath: "@dashboardpack/core/components/ui/breadcrumb",
      },
      {
        name: "Dropdown Menu",
        description:
          "Context menu with items, separators, and keyboard navigation.",
        importPath: "@dashboardpack/core/components/ui/dropdown-menu",
      },
      {
        name: "Command",
        description:
          "Command palette (Cmd+K) with searchable list of actions and pages.",
        importPath: "@dashboardpack/core/components/ui/command",
      },
      {
        name: "Button",
        description:
          "Primary action trigger with variants: default, destructive, outline, secondary, ghost, link. Multiple sizes available.",
        importPath: "@dashboardpack/core/components/ui/button",
      },
      {
        name: "Tabs",
        description:
          "Tabbed interface for switching between content panels. Supports controlled and uncontrolled modes.",
        importPath: "@dashboardpack/core/components/ui/tabs",
      },
      {
        name: "Toggle Group",
        description:
          "Group of toggle buttons for selecting one or multiple options from a set.",
        importPath: "@dashboardpack/core/components/ui/toggle-group",
      },
    ],
  },
  {
    title: "Shared Components",
    items: [
      {
        name: "DataTable",
        description:
          "Full-featured data table built on TanStack Table with column filtering, sorting, pagination, CSV export, and mobile responsive card view.",
        importPath: "@dashboardpack/core/components/shared/data-table",
      },
      {
        name: "PageHeader",
        description:
          "Reusable page header with title, description, breadcrumbs, and action slot.",
        importPath: "@dashboardpack/core/components/shared/page-header",
      },
      {
        name: "ConfirmDialog",
        description:
          "Pre-configured confirmation dialog for destructive actions with customizable title, message, and button labels.",
        importPath: "@dashboardpack/core/components/shared/confirm-dialog",
      },
      {
        name: "EmptyState",
        description:
          "Placeholder display for empty data states with icon, title, description, and optional action button.",
        importPath: "@dashboardpack/core/components/shared/empty-state",
      },
      {
        name: "DateRangePicker",
        description:
          "Dual-calendar date range selector with preset ranges and popover display.",
        importPath: "@dashboardpack/core/components/shared/date-range-picker",
      },
    ],
  },
];

export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-sm text-muted-foreground">
          35+ UI components organized by category. Each component is vendored
          source code that you own and can customize.
        </p>
      </div>

      {/* Adding new components */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Adding New Components</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The project includes a{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            components.json
          </code>{" "}
          configuration file, so you can scaffold new shadcn/ui components
          using the CLI:
        </p>
        <CodeBlock code={`npx shadcn@latest add accordion`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          This generates the component source file in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            src/components/ui/
          </code>{" "}
          with all dependencies resolved.
        </p>
      </section>

      {/* Storybook */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Storybook Component Browser</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The project includes Storybook with 15 interactive stories covering
          core UI primitives, form components, and dashboard widgets. Launch it
          to visually browse and test components in isolation:
        </p>
        <CodeBlock code={`npm run storybook`} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Storybook opens on{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            http://localhost:6006
          </code>
          . Build a static version with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            npm run build-storybook
          </code>
          .
        </p>
      </section>

      {/* Component groups */}
      {componentGroups.map((group) => (
        <section key={group.title} className="space-y-4">
          <h2 className="text-lg font-semibold">{group.title}</h2>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <code className="text-xs font-mono text-muted-foreground">
                    import {"{ ... }"} from &quot;{item.importPath}&quot;
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Usage pattern */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Common Usage Pattern</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All components follow the same pattern: import the named export, pass
          props and children, and use the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            className
          </code>{" "}
          prop to extend styles:
        </p>
        <CodeBlock code={`import { Button } from "@dashboardpack/core/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Incidents <Badge variant="secondary">12</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardContent>
    </Card>
  );
}`} />
      </section>

      {/* Next steps */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Learn about{" "}
          <Link
            href="/docs/theming"
            className="font-medium text-primary hover:underline"
          >
            Theming
          </Link>{" "}
          to customize component colors, or see the{" "}
          <Link
            href="/docs/deployment"
            className="font-medium text-primary hover:underline"
          >
            Deployment
          </Link>{" "}
          guide when you are ready to ship.
        </p>
      </section>
    </div>
  );
}
