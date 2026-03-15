import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Tooltip, TooltipProps } from "boring-blocks"

import { argType } from "./utils/arg-types"
import { cn } from "../../src/utils/cn"

const placements: TooltipProps["placement"][] = [
  "cursor",
  "top",
  "bottom",
  "left",
  "right",
] as const

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: argType.enum("select", placements),
    trigger: argType.disabled(),
    children: argType.disabled(),
  },
  args: {
    placement: "cursor",
    trigger: <Button>Trigger</Button>,
    children: "Tooltip",
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Placements: Story = {
  render: (args, { viewMode }) => (
    <div
      className={cn(
        "grid size-full place-content-center",
        viewMode !== "docs" && "[*:has(&)]:size-full"
      )}
      style={{ gridTemplate: '". top ." "left cursor right" ". bottom ."' }}
    >
      {placements.map(placement => (
        <Tooltip
          {...args}
          key={placement}
          placement={placement}
          trigger={
            <Button style={{ gridArea: placement }} onClick={() => null}>
              {placement}
            </Button>
          }
        >
          {placement}
        </Tooltip>
      ))}
    </div>
  ),
}
