import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@dashboardpack/core/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account information, including your name, email, and
            profile picture.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Password Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your password and configure two-factor authentication for
            added security.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Choose which notifications you want to receive and how you want to
            be notified.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Dashboard overview with key metrics and recent activity.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Detailed analytics including charts, graphs, and trend data.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Generated reports with export options and scheduling.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            General application settings and configuration options.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="appearance">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your dashboard.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="integrations">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Manage third-party service integrations and API connections.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
