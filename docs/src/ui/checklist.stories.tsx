import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Checklist } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/Checklist",
  component: Checklist,
  argTypes: {
    title: argType.string(),
    noItemsLabel: argType.string(),
    items: argType.disabled(),
    onChange: argType.callback(),
  },
  args: {
    title: "Checklist Title",
    noItemsLabel: "The list is currently empty",
    onChange: action("onChange"),
    items: [
      { id: "1", label: "Dogs are friendly", checked: true },
      { id: "2", label: "Cats are cute", checked: false },
      { id: "3", label: "Ducks do quack", checked: false },
    ],
  },
} satisfies Meta<typeof Checklist>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "Checklist",
  args: {},
  render: args => {
    const [items, setItems] = useState(args.items)
    return (
      <div className="max-w-80">
        <Checklist {...args} items={items} onChange={setItems} />
      </div>
    )
  },
}
