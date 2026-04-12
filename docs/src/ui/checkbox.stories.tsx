import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Checkbox, hstack } from "boring-blocks"
import { cn } from "boring-blocks/utils"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: argType.disabled(),
    initialChecked: argType.disabled(),
    onCheckedChange: argType.callback(),
    name: argType.string(),
    value: argType.string(),
  },
  args: {},
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const BoxOnly: Story = {
  render: args => (
    <div className={cn(hstack({ wrap: true }))}>
      <Checkbox {...args} initialChecked />
      <Checkbox {...args} initialChecked="indeterminate" />
      <Checkbox {...args} initialChecked={false} />
    </div>
  ),
}

export const SingleLineLabel: Story = {
  render: args => (
    <div className="max-w-96">
      <Checkbox {...args} initialChecked>
        Checked with label
      </Checkbox>
      <Checkbox {...args} initialChecked="indeterminate">
        Indeterminate with label
      </Checkbox>
      <Checkbox {...args} initialChecked={false}>
        Unchecked with label
      </Checkbox>
    </div>
  ),
}

const longLabel =
  "a very long label that will cause the text to overflow the component and end up in ellipsis if everything is styled correctly. This part here shouldn't be visible."

export const MultiLineLabel: Story = {
  render: args => (
    <div className="max-w-96">
      <Checkbox {...args} initialChecked>
        Checked with {longLabel}
      </Checkbox>
      <Checkbox {...args} initialChecked="indeterminate">
        Indeterminate with {longLabel}
      </Checkbox>
      <Checkbox {...args} initialChecked={false}>
        Unchecked with {longLabel}
      </Checkbox>
    </div>
  ),
}
