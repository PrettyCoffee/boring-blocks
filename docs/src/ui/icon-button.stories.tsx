import type { Meta, StoryObj } from "@storybook/react-vite"
import { IconButton, type IconButtonProps } from "boring-blocks"
import { Fragment } from "react/jsx-runtime"

import { argType } from "../utils/arg-type"

const titleSides = [
  "top",
  "bottom",
  "left",
  "right",
] satisfies IconButtonProps["titleSide"][]

const kinds = [
  "key",
  "ghost",
  "flat",
  "destructive",
] satisfies IconButtonProps["look"][]

const meta = {
  title: "Buttons/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),
    disabled: argType.boolean(),
    title: argType.string(),
    titleSide: argType.enum("select", titleSides),
    active: argType.boolean(),
    look: argType.enum("select", kinds),
    size: argType.enum("radio", ["md", "sm"]),
    icon: argType.props.icon,
    iconColor: argType.props.iconColor,

    href: argType.string(),
    target: argType.string(),

    onClick: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    title: "Title!",
    look: "flat",
    size: "md",
    active: false,
    disabled: false,
    icon: argType.props.icon.default,
    iconColor: "current",
  },
  render: args => <IconButton key={args.titleSide} {...args} />,
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Variants: Story = {
  render: args => (
    <div className="inline-grid grid-cols-[auto_auto_auto_auto] items-center gap-1">
      {kinds.map(look => (
        <Fragment key={look}>
          <span className="mr-2 text-text-gentle">{look}:</span>
          <IconButton {...args} look={look} title="Default" />
          <IconButton {...args} look={look} title="Active" active />
          <IconButton {...args} look={look} title="Disabled" disabled />
        </Fragment>
      ))}
    </div>
  ),
}
