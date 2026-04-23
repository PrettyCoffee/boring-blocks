import { afterEach, describe, expect, it, vi } from "vitest"

import { render, screen } from "test"

import { ErrorBoundary } from "./error-boundary"

const Throw = () => {
  throw new Error("Test error")
}

describe("Test ErrorBoundary", () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it("doesn't do anything in a healthy ui", () => {
    render(
      <ErrorBoundary>
        <button>button</button>
      </ErrorBoundary>
    )
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.queryByText("💥")).not.toBeInTheDocument()
  })

  it("displays an explosion if something broke", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => null)

    render(
      <ErrorBoundary>
        <Throw />
        <button>button</button>
      </ErrorBoundary>
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.getByText("💥")).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalled()
  })

  it("displays a fallback component if something broke", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => null)

    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Throw />
        <button>button</button>
      </ErrorBoundary>
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.getByText("Fallback")).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalled()
  })
})
