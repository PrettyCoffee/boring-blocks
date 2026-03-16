import type { Meta, StoryObj } from "@storybook/react-vite"
import { Icon, type IconProps } from "boring-blocks"
import { Fragment } from "react/jsx-runtime"

import { argType } from "../utils/arg-type"

const iconSizes: IconProps["size"][] = ["xs", "sm", "md", "lg", "xl"] as const

const meta = {
  title: "Primitives/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),

    icon: argType.props.icon,
    strokeWidth: argType.number(),
    color: argType.props.iconColor,
    filled: argType.boolean(),
    size: argType.enum("select", iconSizes),
  },
  args: {
    color: argType.props.iconColor.default,
    filled: false,
    icon: argType.props.icon.default,
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
      style={{ gridTemplateColumns: `repeat(${iconSizes.length + 1}, auto)` }}
    >
      <span />

      {iconSizes.map(size => (
        <div key={size} className="place-self-center">
          {size}
        </div>
      ))}

      {Object.values(argType.props.iconColor.values).map(color => (
        <Fragment key={color}>
          <div className="self-center justify-self-end">{color}:</div>
          {iconSizes.map(size => (
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
