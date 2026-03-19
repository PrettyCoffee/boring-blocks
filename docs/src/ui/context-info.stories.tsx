import { Meta, StoryObj } from "@storybook/react-vite"
import { ContextInfo } from "boring-blocks"
import { GhostIcon } from "boring-blocks/icons"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta: Meta<typeof ContextInfo> = {
  title: "Feedback/ContextInfo",
  component: ContextInfo,
  argTypes: {
    icon: argType.props.icon,
    label: argType.string(),
    animateIcon: argType.enum("radio", ["float", "rotate"]),
    buttons: argType.disabled(),
  },
  args: {
    icon: GhostIcon,
    animateIcon: "float",
    label: "There is no data to be found here. Create some to get started!",
  },
}

export default meta

type Story = StoryObj<typeof ContextInfo>

export const Default: Story = {}

export const Buttons: Story = {
  render: args => (
    <ContextInfo
      {...args}
      buttons={[
        {
          look: "flat",
          onClick: action("buttons[0].onClick"),
          caption: "Click there! ->",
        },
        {
          look: "key",
          onClick: action("buttons[1].onClick"),
          caption: "Click me!",
        },
      ]}
    ></ContextInfo>
  ),
}
