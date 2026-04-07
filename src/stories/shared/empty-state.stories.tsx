import type { Meta, StoryObj } from "@storybook/react";
import { Inbox, Search, FileX2 } from "lucide-react";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";
import { Button } from "@dashboardpack/core/components/ui/button";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No results found",
  },
};

export const WithDescription: Story = {
  args: {
    title: "No results found",
    description:
      "Try adjusting your search or filter to find what you are looking for.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Inbox />,
    title: "No messages",
    description: "Your inbox is empty. New messages will appear here.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <FileX2 />,
    title: "No documents",
    description: "Get started by creating your first document.",
    action: <Button size="sm">Create Document</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <Search />,
    title: "No matching results",
    description:
      "We could not find anything matching your search. Try different keywords.",
    action: (
      <Button variant="outline" size="sm">
        Clear Search
      </Button>
    ),
  },
};
