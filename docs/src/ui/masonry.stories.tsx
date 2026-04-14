import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { Card, Masonry } from "boring-blocks"

import { argType } from "../utils/arg-type"
import { createRange } from "../utils/create-range"

const meta = {
  title: "Layout/Masonry",
  component: Masonry.Grid,
  argTypes: {
    minColumnWidth: argType.number(),
    gap: argType.number(),
    transitionDuration: argType.number(),
  },
  args: {
    minColumnWidth: 320,
    gap: 16,
    transitionDuration: 200,
  },
} satisfies Meta<typeof Masonry.Grid>

export default meta

type Story = StoryObj<typeof Masonry.Grid>

faker.seed(1337)

const items = createRange(20).map(key => ({
  key,
  text: faker.lorem.paragraphs({ min: 1, max: 5 }),
}))

export const Default: Story = {
  name: "Masonry",
  render: args => (
    <Masonry.Grid {...args}>
      {items.map(({ key, text }, index) => (
        <Masonry.Item key={key}>
          <Card title={String(index + 1)} description={text} />
        </Masonry.Item>
      ))}
    </Masonry.Grid>
  ),
}
