import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { Button } from "../../src"
import { argType } from "./utils/argTypes"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),
    children: argType.string(),
    disabled: argType.boolean(),
    title: argType.string(),
    href: argType.string(),
    target: argType.string(),
    onClick: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    children: "Button", onClick: fn(),
    onBlur: fn(),
    onFocus: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: { },
}
export const Anchor: Story = {
  args: { href: "#" },
}
