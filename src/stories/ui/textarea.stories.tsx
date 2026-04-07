import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">
        Your Message
      </label>
      <Textarea id="message" placeholder="Type your message here..." />
      <p className="text-xs text-muted-foreground">
        Your message will be sent to the support team.
      </p>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      "This textarea already has some content that the user can edit or extend as needed.",
  },
};
