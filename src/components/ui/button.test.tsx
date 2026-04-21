import { describe, expect, it, vi } from "vitest"

import { render, screen } from "test"

import { CircleIcon } from "../icons"
import { Button } from "./button"

describe("Test Button", () => {
  it("renders a clickable button", async () => {
    const click = vi.fn()
    const { user } = render(<Button onClick={click}>button</Button>)

    const button = screen.getByRole("button", { name: "button" })
    await user.click(button)
    expect(click).toHaveBeenCalled()
  })

  it("renders a disabled button", async () => {
    const click = vi.fn()
    const { user } = render(
      <Button onClick={click} disabled>
        button
      </Button>
    )
    const button = screen.getByRole("button")
    await user.click(button)
    expect(click).not.toHaveBeenCalled()
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("renders an internal anchor", () => {
    const href = window.location.origin + "/test"
    render(<Button href={href}>button</Button>)

    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", href)
    expect(screen.queryByIconName("ExternalLink")).not.toBeInTheDocument()
  })

  it("renders an external anchor", () => {
    const href = "https://google.com/test"
    render(<Button href={href}>button</Button>)

    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", href)
    expect(screen.getByIconName("ExternalLink")).toBeInTheDocument()
  })

  it("renders a button with an icon", () => {
    render(
      <Button onClick={vi.fn()} icon={CircleIcon}>
        button
      </Button>
    )
    expect(screen.getByIconName("Circle")).toBeInTheDocument()
  })

  it("renders a tooltip", async () => {
    const { user } = render(
      <Button onClick={vi.fn()} title="Tooltip" titleSide="top">
        button
      </Button>
    )

    await user.hover(screen.getByRole("button"))
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toHaveTextContent(
      "Tooltip"
    )
  })

  it("Allows rendering a custom element", async () => {
    const click = vi.fn()
    const { user } = render(
      <Button asChild onClick={click} icon={CircleIcon}>
        <div role="gridcell">button</div>
      </Button>
    )
    const button = screen.getByRole("gridcell", { name: "button" })
    expect(screen.getByIconName("Circle")).toBeInTheDocument()
    await user.click(button)
    expect(click).toHaveBeenCalled()
  })
})
