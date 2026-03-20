import { type Meta, type StoryObj } from "@storybook/react-vite"
import { FileInput, vstack } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/FileInput",
  component: FileInput,
  argTypes: {
    icon: argType.disabled(),
    label: argType.string(),
    alert: argType.disabled(),
    onChange: argType.callback(),
    accept: argType.string(),
    multiple: argType.boolean(),
  },
  args: {
    label: "Drop .png",
    accept: "image/png",
    multiple: false,
    onChange: action("onChange"),
  },
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Alerts: Story = {
  render: args => (
    <div className={vstack({ gap: 4, align: "start" })}>
      <FileInput
        {...args}
        alert={{ kind: "info", text: "FYI: You can upload stuff here!" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "success", text: "Yay, you uploaded it :)" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "error", text: "Oof, something did not work out :(" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "warn", text: "Thats a warning, you better watch out!" }}
      />
    </div>
  ),
}
