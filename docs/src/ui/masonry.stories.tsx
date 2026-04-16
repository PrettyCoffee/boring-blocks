import { useEffect, useState } from "react"

import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { Card, Masonry } from "boring-blocks"

import { Placeholder } from "../fragments/placeholder"
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

const items = createRange(20).map(index => ({
  index,
  text: faker.lorem.paragraphs({ min: 1, max: 5 }),
}))

export const Default: Story = {
  name: "Masonry",
  render: args => (
    <Masonry.Grid {...args}>
      {items.map(({ index, text }) => (
        <Masonry.Item key={index}>
          <Card title={String(index + 1)} description={text} />
        </Masonry.Item>
      ))}
    </Masonry.Grid>
  ),
}

const getRandomHeight = () => faker.number.int({ min: 50, max: 300 })
const ResizableItem = ({ index }: (typeof items)[number]) => {
  const { updateLayout } = Masonry.useContext()
  const [height, setHeight] = useState(getRandomHeight)

  useEffect(() => {
    let timeout = 0
    const loopTick = () => {
      const ms = faker.number.int({ min: 1000, max: 5000 })
      timeout = window.setTimeout(() => {
        setHeight(getRandomHeight)
        window.requestAnimationFrame(() => updateLayout())
        loopTick()
      }, ms)
    }

    loopTick()

    return () => {
      window.clearTimeout(timeout)
    }
  }, [updateLayout])

  return (
    <Masonry.Item>
      <Card title={String(index + 1)} description="">
        <Placeholder style={{ height }} />
      </Card>
    </Masonry.Item>
  )
}

export const ResizingItems: Story = {
  name: "Resizing items",
  render: args => (
    <Masonry.Grid {...args}>
      {items.map(item => (
        <ResizableItem key={item.index} {...item} />
      ))}
    </Masonry.Grid>
  ),
}
