import { type Meta, type StoryObj } from "@storybook/react-vite"
import { hstack, Divider, type DividerProps } from "boring-blocks"
import { cn } from "boring-blocks/utils"

import { argType } from "../utils/arg-type"

const colors = [
  "text",
  "default",
  "gentle",
  "muted",
] satisfies DividerProps["color"][]

const meta = {
  title: "Primitives/Divider",
  component: Divider,
  argTypes: {
    color: argType.enum("radio", colors),
    orientation: argType.disabled(),
  },
  args: {
    orientation: "horizontal",
    color: "gentle",
  },
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof Divider>

export const Default: Story = {
  name: "Divider",
  render: args => (
    <>
      {colors.map(color => (
        <Divider
          key={color}
          {...args}
          color={color}
          orientation="horizontal"
          className="my-4"
        />
      ))}
      <Divider {...args} orientation="horizontal" />
      <div className={cn(hstack({ justify: "between" }), "my-2 h-12 px-2")}>
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
      </div>
      <Divider {...args} orientation="horizontal" />
    </>
  ),
}
