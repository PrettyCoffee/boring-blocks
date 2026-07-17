import { useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import { Slider, type SliderProps } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/Slider",
  component: Slider,
  argTypes: {
    label: argType.string(),
    value: argType.disabled(),
    unit: argType.string(),
    min: argType.number(),
    max: argType.number(),
    step: argType.number(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
  },
  args: {
    label: "Length",
    value: 50,
    unit: "cm",
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    onChange: action("onChange"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: SliderProps) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Slider
      {...props}
      value={value}
      onChange={(value, event) => {
        onChange?.(value, event)
        setValue(value)
      }}
    />
  )
}

export const Default: Story = { render: ControlledStory }
