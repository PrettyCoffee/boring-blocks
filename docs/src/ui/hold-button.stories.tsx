import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoldButton, type HoldButtonProps } from "boring-blocks"
import { Fragment } from "react/jsx-runtime"

import { argType } from "../utils/arg-type"

const titleSides = [
  "top",
  "bottom",
  "left",
  "right",
] satisfies HoldButtonProps["titleSide"][]

const kinds = [
  "key",
  "ghost",
  "flat",
  "destructive",
] satisfies HoldButtonProps["look"][]

const captions = {
  idle: "Idle",
  holding: "Holding",
  triggered: "Triggered",
}

const meta = {
  title: "Buttons/HoldButton",
  component: HoldButton,
  argTypes: {
    ref: argType.disabled(),
    captions: argType.disabled(),
    disabled: argType.boolean(),
    title: argType.string(),
    titleSide: argType.enum("select", titleSides),
    active: argType.boolean(),
    look: argType.enum("select", kinds),
    size: argType.enum("radio", ["md", "sm"]),
    icon: argType.props.icon,
    iconColor: argType.props.iconColor,

    holdDuration: argType.number(),
    onPointerDown: argType.callback(),
    onPointerUp: argType.callback(),
    onPointerEnter: argType.callback(),
    onPointerLeave: argType.callback(),

    onClick: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    holdDuration: 1500,
    captions,
    look: "flat",
    size: "md",
    active: false,
    disabled: false,
    icon: argType.props.icon.default,
    iconColor: "current",
  },
  render: args => <HoldButton key={args.titleSide} {...args} />,
} satisfies Meta<typeof HoldButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "HoldButton",
  render: args => (
    <div className="inline-grid grid-cols-[auto_auto_auto_auto] items-center gap-1">
      {kinds.map(look => (
        <Fragment key={look}>
          <span className="mr-2 text-text-gentle">{look}:</span>
          <HoldButton {...args} look={look} />
          <HoldButton {...args} look={look} active />
          <HoldButton {...args} look={look} disabled />
        </Fragment>
      ))}
    </div>
  ),
}
