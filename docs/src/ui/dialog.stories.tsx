import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Button, Dialog, showDialog } from "boring-blocks"
import { action } from "storybook/actions"

import { Placeholder } from "../fragments/placeholder"
import { argType } from "../utils/arg-type"

const meta = {
  title: "Floating/Dialog",
  component: Dialog,
  argTypes: {
    title: argType.string(),
    description: argType.string(),
    cancel: argType.disabled(),
    confirm: argType.disabled(),
    onClose: argType.callback(),
  },
  args: {
    title: "Dialog Title",
    description:
      "This dialog is here for demonstration purposes and has a very informative description.",
    onClose: action("onClose"),
    confirm: { onClick: action("confirm.onClick") },
    cancel: { onClick: action("cancel.onClick") },
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const ShowDialog: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button")
    await userEvent.click(button)
  },
  render: args => (
    <Button onClick={() => showDialog({ ...args, content: <Placeholder /> })}>
      Open
    </Button>
  ),
}

export const Component: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button")
    await userEvent.click(button)
  },
  render: args => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        {open && (
          <Dialog
            {...args}
            onClose={() => {
              setOpen(false)
              args.onClose?.()
            }}
          >
            <Placeholder />
          </Dialog>
        )}
      </>
    )
  },
}
