import { useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import { TimeInput, type TimeInputProps } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/TimeInput",
  component: TimeInput,
  argTypes: {
    value: argType.disabled(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
    onKeyDown: argType.callback(),
    onKeyUp: argType.callback(),
  },
  args: {
    disabled: false,
    onChange: action("onChange"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
    onKeyDown: action("onKeyDown"),
    onKeyUp: action("onKeyUp"),
  },
} satisfies Meta<typeof TimeInput>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: TimeInputProps) => {
  const [value, setValue] = useState(
    () => initialValue ?? new Temporal.PlainTime(13, 15)
  )
  return (
    <TimeInput
      {...props}
      value={value}
      onChange={(value, event) => {
        onChange?.(value, event)
        setValue(value)
      }}
    />
  )
}

export const Default: Story = {
  name: "TimeInput",
  render: ControlledStory,
}
