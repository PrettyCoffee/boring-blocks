import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, type ButtonProps } from "boring-blocks"
import { Fragment } from "react/jsx-runtime"

import { argType } from "../utils/arg-type"

const titleSides = [
  "top",
  "bottom",
  "left",
  "right",
] satisfies ButtonProps["titleSide"][]

const kinds = [
  "key",
  "ghost",
  "flat",
  "link",
  "destructive",
] satisfies ButtonProps["look"][]

const meta = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    ref: argType.disabled(),
    children: argType.string(),
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
    children: "Button",
    look: "flat",
    size: "md",
    active: false,
    disabled: false,
    icon: argType.props.icon.default,
    iconColor: "current",
  },
  render: args => <Button key={args.titleSide} {...args} />,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}
export const TitleTooltip: Story = { args: { title: "Title tooltip" } }

export const Variants: Story = {
  render: args => (
    <div className="inline-grid grid-cols-[auto_auto_auto_auto_auto] items-center gap-1">
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
          <Button
            {...(args as {})}
            look={look}
            href="https://github.com/PrettyCoffee/boring-blocks"
          >
            Link
          </Button>
        </Fragment>
      ))}
    </div>
  ),
}
