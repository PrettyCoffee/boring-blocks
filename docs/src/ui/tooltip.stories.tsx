import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Tooltip, type TooltipProps } from "boring-blocks"
import { cn } from "boring-blocks/utils"

import { argType } from "../utils/arg-type"

const placements: TooltipProps["placement"][] = [
  "cursor",
  "top",
  "bottom",
  "left",
  "right",
] as const

const meta = {
  title: "Floating/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: argType.enum("select", placements),
    trigger: argType.disabled(),
    children: argType.disabled(),
  },
  args: {
    placement: "cursor",
    trigger: <Button onClick={() => null}>Trigger</Button>,
    children: "Tooltip",
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button"))
  },
}

export const Placements: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "top" }))
  },
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
