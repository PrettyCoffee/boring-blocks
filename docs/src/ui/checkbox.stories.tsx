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
  },
  args: {},
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div className={cn(hstack({ wrap: true }))}>
      <Checkbox {...args} initialChecked />
      <Checkbox {...args} initialChecked="indeterminate" />
      <Checkbox {...args} initialChecked={false} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: args => (
    <div className="w-max">
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
