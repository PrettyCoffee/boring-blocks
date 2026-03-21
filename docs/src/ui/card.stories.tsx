import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Card } from "boring-blocks"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Layout/Card",
  component: Card,
  argTypes: {
    title: argType.string(),
    description: argType.string(),
    Headline: argType.enum("radio", ["h2", "h3"]),
  },
  args: {
    title: "Card Title",
    description:
      "This card is here for demonstration purposes and has a very informative description.",
    Headline: "h2",
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "Card",
  render: args => (
    <Card {...args} className="max-w-sm">
      <svg
        className="h-40 w-full stroke-stroke/50"
        strokeLinecap="round"
        fill="transparent"
        strokeWidth={2}
      >
        <rect width="100%" height="100%" />
        <line x1="10%" y1="10%" x2="90%" y2="90%" />
        <line x1="10%" y1="90%" x2="90%" y2="10%" />
      </svg>
    </Card>
  ),
}
