import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react/jsx-runtime"

import { Button } from "../../src"
import { argType } from "./utils/arg-types"
import { InteractiveProps } from "../../src/styles/interactive"

const kinds: InteractiveProps["look"][] = [
  "key",
  "ghost",
  "flat",
  "link",
  "destructive",
] as const

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),
    children: argType.string(),
    disabled: argType.boolean(),
    title: argType.string(),

    active: argType.boolean(),
    look: argType.enum("select", kinds),
    size: argType.enum("radio", ["md", "sm"]),

    href: argType.string(),
    target: argType.string(),

    onClick: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    children: "Button",
    look: "flat",
    size: "md",
    active: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Variants: Story = {
  render: args => (
    <div className="inline-grid grid-cols-[auto_auto_auto_auto] items-center gap-1">
      {kinds.map(look => (
        <Fragment key={look}>
          <span className="mr-2 text-text-gentle">{look}:</span>
          <Button {...args} look={look}>
            Default
          </Button>
          <Button {...args} look={look} active>
            Active
          </Button>
          <Button {...args} look={look} disabled>
            Disabled
          </Button>
        </Fragment>
      ))}
    </div>
  ),
}
