import { useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import { TextArea, type TextAreaProps } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/TextArea",
  component: TextArea,
  argTypes: {
    value: argType.disabled(),
    placeholder: argType.string(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
    onKeyDown: argType.callback(),
    onKeyUp: argType.callback(),
  },
  args: {
    placeholder: "Type something",
    disabled: false,
    onChange: action("onChange"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
    onKeyDown: action("onKeyDown"),
    onKeyUp: action("onKeyUp"),
  },
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: TextAreaProps) => {
  const [value, setValue] = useState(initialValue ?? "")
  return (
    <TextArea
      {...props}
      value={value}
      onChange={(value, event) => {
        onChange?.(value, event)
        setValue(value)
      }}
    />
  )
}

export const Default: Story = { name: "TextArea", render: ControlledStory }
