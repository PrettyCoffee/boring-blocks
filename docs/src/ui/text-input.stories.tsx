import { useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import { TextInput, type TextInputProps, vstack } from "boring-blocks"
import { cn } from "boring-blocks/utils"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/TextInput",
  component: TextInput,
  argTypes: {
    value: argType.disabled(),
    type: argType.enum(),
    placeholder: argType.string(),
    alert: argType.disabled(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
    onKeyDown: argType.callback(),
    onKeyUp: argType.callback(),
  },
  args: {
    type: "text",
    placeholder: "Type something",
    disabled: false,
    onChange: action("onChange"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
    onKeyDown: action("onKeyDown"),
    onKeyUp: action("onKeyUp"),
  },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue ?? "")
  return (
    <TextInput
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

export const Alerts: Story = {
  render: args => (
    <div className={cn(vstack({ gap: 2 }), "w-64")}>
      <ControlledStory {...args} alert={{ kind: "info", text: "INFO!!!" }} />
      <ControlledStory
        {...args}
        alert={{ kind: "success", text: "SUCCESS!!!" }}
      />
      <ControlledStory {...args} alert={{ kind: "warn", text: "WARN!!!" }} />
      <ControlledStory {...args} alert={{ kind: "error", text: "ERROR!!!" }} />
    </div>
  ),
}

export const Search: Story = {
  args: { type: "search" },
  render: args => (
    <div className={cn(vstack({ gap: 2 }), "w-64")}>
      <ControlledStory {...args} />
      <ControlledStory {...args} alert={{ kind: "warn", text: "WARN!!!" }} />
    </div>
  ),
}
