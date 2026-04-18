import { type Ref } from "react"

import { describe, expect, it, vi } from "vitest"

import { render, screen } from "test"

import { focusElement } from "./focus-element"

describe("Test focusElement", () => {
  it("should focus a focusable element", () => {
    const element: Ref<HTMLButtonElement> = { current: null }
    render(<button ref={element}>Test</button>)
    focusElement(element.current)
    expect(screen.getByRole("button")).toHaveFocus()
  })

  it("should select a selectable element", () => {
    const element: Ref<HTMLInputElement> = { current: null }
    render(<input type="text" ref={element} value="value" onChange={vi.fn()} />)
    focusElement(element.current)
    expect(screen.getByRole("textbox")).toHaveFocus()
    expect(screen.getByRole("textbox")).toHaveSelection("value")
  })
})
