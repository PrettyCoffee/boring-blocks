import { useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import { NumberInput, type NumberInputProps, vstack } from "boring-blocks"
import { cn } from "boring-blocks/utils"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/NumberInput",
  component: NumberInput,
  argTypes: {
    value: argType.disabled(),
    unit: argType.string(),
    min: argType.number(),
    max: argType.number(),
    placeholder: argType.string(),
    alert: argType.disabled(),
    id: argType.string(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
    onKeyDown: argType.callback(),
    onKeyUp: argType.callback(),
  },
  args: {
    min: -999_999,
    max: 999_999,
    unit: "kb",
    placeholder: "1234",
    disabled: false,
    onChange: action("onChange"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
    onKeyDown: action("onKeyDown"),
    onKeyUp: action("onKeyUp"),
  },
} satisfies Meta<typeof NumberInput>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState(initialValue)
  return (
    <NumberInput
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
