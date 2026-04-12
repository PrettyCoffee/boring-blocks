import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, hstack, IconButton, Popover } from "boring-blocks"
import {
  BirdIcon,
  CatIcon,
  DogIcon,
  PandaIcon,
  RabbitIcon,
  RatIcon,
  SquirrelIcon,
  TurtleIcon,
  WormIcon,
} from "boring-blocks/icons"
import { cn } from "boring-blocks/utils"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const placements: Popover.Root.Props["placement"][] = [
  "top-start",
  "top",
  "top-end",

  "bottom-start",
  "bottom",
  "bottom-end",

  "left-start",
  "left",
  "left-end",

  "right-start",
  "right",
  "right-end",
] as const

const meta = {
  title: "Floating/Popover",
  component: Popover.Root,
  subcomponents: {
    Trigger: Popover.Trigger,
    Content: Popover.Content,
  },
  argTypes: {
    placement: argType.enum("select", placements),
    initialOpen: argType.disabled(),
    open: argType.disabled(),
    onOpenChange: argType.callback(),
  },
  args: {
    placement: "bottom",
    onOpenChange: action("onOpenChange"),
  },
} satisfies Meta<typeof Popover.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "Popover",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"))
  },
  render: args => (
    <Popover.Root {...args}>
      <Popover.Trigger>
        <Button look="ghost">Open</Button>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Close>
          <div className={cn(hstack({ gap: 1, wrap: true }), "max-w-26")}>
            {[
              BirdIcon,
              SquirrelIcon,
              RatIcon,
              PandaIcon,
              CatIcon,
              DogIcon,
              RabbitIcon,
              TurtleIcon,
              WormIcon,
            ].map(icon => (
              <IconButton
                key={icon.displayName}
                icon={icon}
                title={icon.displayName ?? ""}
                size="sm"
                onClick={() => null}
              />
            ))}
          </div>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  ),
}
