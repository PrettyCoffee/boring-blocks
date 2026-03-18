import { Meta, StoryObj } from "@storybook/react-vite"
import { showToast, Button, Toaster, ToastProps } from "boring-blocks"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Feedback/Toaster",
  argTypes: {
    kind: argType.enum(),
    title: argType.string(),
    message: argType.string(),
    duration: argType.disabled(),
  },
  args: {
    kind: "info",
    title: "Hello there!",
    message: "This is a message",
  },
} satisfies Meta<ToastProps>

export default meta

type Story = StoryObj<typeof meta>

export const Toasts: Story = {
  name: "Toaster",
  args: { kind: "error" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }))
    await userEvent.click(canvas.getByRole("button", { name: "Info" }))
    await userEvent.click(canvas.getByRole("button", { name: "Warn" }))
    await userEvent.click(canvas.getByRole("button", { name: "Error" }))
  },
  render: () => (
    <>
      <Toaster />

      <Button
        onClick={() => showToast({ kind: "success", title: "Oh yes! :)" })}
      >
        Success
      </Button>
      <Button
        onClick={() => showToast({ kind: "info", title: "Uh, hello! c:" })}
      >
        Info
      </Button>
      <Button
        onClick={() =>
          showToast({ kind: "warn", title: "Better look out! :0" })
        }
      >
        Warn
      </Button>
      <Button onClick={() => showToast({ kind: "error", title: "Oh no! :(" })}>
        Error
      </Button>
    </>
  ),
}
