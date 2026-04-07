import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight, Loader2, Mail } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Go forward",
  },
  render: (args) => (
    <Button {...args}>
      <ChevronRight />
    </Button>
  ),
};

export const WithIcon: Story = {
  args: {
    children: "Send Email",
  },
  render: (args) => (
    <Button {...args}>
      <Mail />
      {args.children}
    </Button>
  ),
};

export const WithTrailingIcon: Story = {
  args: {
    children: "Next",
  },
  render: (args) => (
    <Button {...args}>
      {args.children}
      <ChevronRight />
    </Button>
  ),
};

export const Loading: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Button {...args}>
      <Loader2 className="animate-spin" />
      Loading...
    </Button>
  ),
};
