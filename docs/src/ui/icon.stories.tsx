import type { Meta, StoryObj } from "@storybook/react-vite"
import { Icon, type IconProps } from "boring-blocks"
import { BadgeCheck } from "boring-blocks/icons"
import { Fragment } from "react/jsx-runtime"

import { argType } from "../utils/arg-types"

const colors: IconProps["color"][] = [
  "default",
  "gentle",
  "muted",
  "highlight",
  "invert",
  "info",
  "success",
  "warn",
  "error",
] as const

const sizes: IconProps["size"][] = ["xs", "sm", "md", "lg", "xl"] as const

const meta = {
  title: "Primitives/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),

    icon: argType.disabled(),
    strokeWidth: argType.number(),
    color: argType.enum("select", colors),
    filled: argType.boolean(),
    size: argType.enum("select", sizes),
  },
  args: {
    color: "default",
    filled: false,
    icon: BadgeCheck,
    size: "md",
    strokeWidth: undefined,
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Variants: Story = {
  render: args => (
    <div
      className="inline-grid gap-x-2 gap-y-1"
      style={{ gridTemplateColumns: `repeat(${sizes.length + 1}, auto)` }}
    >
      <span />

      {sizes.map(size => (
        <div key={size} className="place-self-center">
          {size}
        </div>
      ))}

      {colors.map(color => (
        <Fragment key={color}>
          <div className="self-center justify-self-end">{color}:</div>
          {sizes.map(size => (
            <Icon
              key={size}
              {...args}
              size={size}
              className="my-1 place-self-center"
              color={color}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
}
