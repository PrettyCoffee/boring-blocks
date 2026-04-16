import { useState } from "react"

import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { Calendar } from "boring-blocks"

import { argType } from "../utils/arg-type"

faker.seed(1337)

const meta = {
  title: "Inputs/Calendar",
  component: Calendar,
  argTypes: {
    initialView: argType.disabled(),
    max: argType.disabled(),
    min: argType.disabled(),
    selected: argType.disabled(),
    onSelectionChange: argType.callback(),
  },
  args: {},
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "Calendar",
  render: function Default(args) {
    const [selected, setSelected] = useState(
      Temporal.Now.plainDateISO().add(new Temporal.Duration(0, 0, 0, 1))
    )
    return (
      <Calendar
        {...args}
        initialView={selected}
        selected={selected}
        onSelectionChange={setSelected}
      />
    )
  },
}
