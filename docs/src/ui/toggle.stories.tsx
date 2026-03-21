import { type PropsWithChildren, useState } from "react"

import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { Toggle, type ToggleProps } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

faker.seed(1337)

const meta = {
  title: "Inputs/Toggle",
  component: Toggle,
  argTypes: {
    label: argType.string(),
    checked: argType.boolean(),
    onChange: argType.callback(),
    disabled: argType.boolean(),
    value: argType.disabled(),
  },
  args: {
    label: "I like ducks and ducks like me!",
    checked: false,
    onChange: action("onChange"),
    disabled: false,
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

const StoryWrapper = ({ children }: PropsWithChildren) => (
  <div className="max-w-96 overflow-hidden">{children}</div>
)

const ControlledToggle = ({ checked, onChange, ...args }: ToggleProps) => {
  const [state, setState] = useState(checked)
  return (
    <Toggle
      {...args}
      checked={state}
      onChange={checked => {
        setState(checked)
        onChange?.(checked)
      }}
    />
  )
}

export const Default: Story = {
  name: "Toggle",
  args: {},
  render: args => (
    <StoryWrapper>
      <ControlledToggle {...args} checked />
      <ControlledToggle {...args} checked={false} />
    </StoryWrapper>
  ),
}
