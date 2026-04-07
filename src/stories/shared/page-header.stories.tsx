import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Download } from "lucide-react";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { Button } from "@dashboardpack/core/components/ui/button";

const meta: Meta<typeof PageHeader> = {
  title: "Shared/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Dashboard",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Servers",
    description: "Monitor and manage your server fleet.",
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: "Server Details",
    description: "View server metrics and configuration.",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Servers", href: "/servers" },
      { label: "web-prod-01" },
    ],
  },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader
      title="Deployments"
      description="Manage your deployment history."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Deployments" },
      ]}
    >
      <Button variant="outline" size="sm">
        <Download className="size-4" />
        Export
      </Button>
      <Button size="sm">
        <Plus className="size-4" />
        New Deploy
      </Button>
    </PageHeader>
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "Settings",
  },
};
