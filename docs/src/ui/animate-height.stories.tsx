import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import { AnimateHeight, Button, hstack } from "boring-blocks"
import { cn } from "boring-blocks/utils"

import { Placeholder } from "../fragments/placeholder"
import { argType } from "../utils/arg-type"

const meta = {
  title: "Utility/AnimateHeight",
  component: AnimateHeight,
  argTypes: {
    delay: argType.number(),
    duration: argType.number(),
    height: argType.enum("radio", ["auto", 100, 200, 300]),
    onTransitionStart: argType.callback(),
    onTransitionEnd: argType.callback(),
  },
  args: {
    duration: 300,
    height: "auto",
  },
} satisfies Meta<typeof AnimateHeight>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => {
    const [contentHeight, setContentHeight] = useState(100)
    return (
      <>
        <div className={cn(hstack({ gap: 2, align: "center" }), "mb-2")}>
          Content Height:
          <Button onClick={() => setContentHeight(100)}>100px</Button>
          <Button onClick={() => setContentHeight(150)}>150px</Button>
          <Button onClick={() => setContentHeight(200)}>200px</Button>
        </div>

        <AnimateHeight {...args} className="w-96 p-2 outline outline-highlight">
          <Placeholder style={{ height: contentHeight + "px" }} />
        </AnimateHeight>
      </>
    )
  },
}
