import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@dashboardpack/core/components/ui/slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xs py-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    max: {
      control: "number",
    },
    min: {
      control: "number",
    },
    step: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 5,
  },
};

export const WithStep: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
};

export const SmallRange: Story = {
  args: {
    defaultValue: [0.3],
    max: 1,
    min: 0,
    step: 0.1,
  },
};
