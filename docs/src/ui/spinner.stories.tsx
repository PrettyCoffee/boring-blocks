import type { Meta, StoryObj } from "@storybook/react-vite"
import { Spinner, SpinnerProps } from "boring-blocks"

import { argType } from "../utils/arg-type"

const sizes = ["sm", "md", "lg", "xl"] satisfies SpinnerProps["size"][]
const colors = [
  "default",
  "current",
  "invert",
] satisfies SpinnerProps["color"][]

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  argTypes: {
    size: argType.enum("select", sizes),
    color: argType.enum("select", colors),
    centered: argType.boolean(),
  },
  args: {
    size: "md",
    color: "default",
    centered: false,
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: "Spinner" }
