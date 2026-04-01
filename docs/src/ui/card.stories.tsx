import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Card } from "boring-blocks"

import { Placeholder } from "../fragments/placeholder"
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
    <div className="size-full bg-linear-135 from-category-blue/15 to-category-pink/15 py-4">
      <Card {...args} className="mx-auto max-w-sm">
        <Placeholder />
      </Card>
    </div>
  ),
}
