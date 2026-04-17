import { useState } from "react"

import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { DateInput } from "boring-blocks"

import { argType } from "../utils/arg-type"

faker.seed(1337)

const meta = {
  title: "Inputs/DateInput",
  component: DateInput,
  argTypes: {
    caption: argType.string(),
    value: argType.disabled(),
    max: argType.disabled(),
    min: argType.disabled(),
    onChange: argType.callback(),
  },
  args: {},
} satisfies Meta<typeof DateInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "DateInput",
  render: function Default(args) {
    const [value, setValue] = useState(Temporal.Now.plainDateISO())
    return <DateInput {...args} value={value} onChange={setValue} />
  },
}
