import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlertBadge, type AlertBadgeProps, Button } from "boring-blocks"

import { argType } from "../utils/arg-type"

const kinds = [
  "error",
  "info",
  "success",
  "warn",
] satisfies AlertBadgeProps["kind"][]

const meta = {
  title: "Feedback/AlertBadge",
  component: AlertBadge,
  argTypes: {
    kind: argType.enum("select", kinds),
    hidden: argType.boolean(),
  },
  args: {
    kind: "info",
    hidden: false,
  },
} satisfies Meta<typeof AlertBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "AlertBadge",
  render: args => (
    <>
      {kinds.map(kind => (
        <Button key={kind}>
          {kind}
          <AlertBadge {...args} kind={kind} />
        </Button>
      ))}
    </>
  ),
}
