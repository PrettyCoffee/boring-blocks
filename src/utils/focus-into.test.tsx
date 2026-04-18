import { type Ref } from "react"

import { describe, expect, it, vi } from "vitest"

import { render, screen } from "test"

import { focusInto, hasFocusableChild } from "./focus-into"

describe("Test focusInto", () => {
  it("should focus the first focusable child", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByRole("button", { name: "1" })).toHaveFocus()
  })

  it("should allow focusing the last focusable child", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
    )

    focusInto(element.current, "end")

    expect(screen.getByRole("button", { name: "3" })).toHaveFocus()
  })

  it("should scan for deep children", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <header>Header</header>
        <section>
          <div>
            <button>1</button>
          </div>
        </section>
        <button>2</button>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByRole("button", { name: "1" })).toHaveFocus()
  })

  it("should respect tabindex prop", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <span tabIndex={0}>span</span>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByText("span")).toHaveFocus()
  })

  it("should prefer positive tabindex over negative", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <span tabIndex={-1}>span negative</span>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <span tabIndex={0}>span positive</span>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByText("span positive")).toHaveFocus()
  })

  it("should ignore disabled elements", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button disabled>1</button>
        <button>2</button>
        <button>3</button>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByRole("button", { name: "2" })).toHaveFocus()
  })

  it("should ignore elements within an container with inert", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <div inert>
          <button>1</button>
        </div>
        <button inert>2</button>
        <button>3</button>
        <button>4</button>
      </div>
    )

    focusInto(element.current)

    expect(screen.getByRole("button", { name: "3" })).toHaveFocus()
  })

  it("should focus container as fallback", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button disabled>1</button>
        <button disabled>2</button>
        <button disabled>3</button>
      </div>
    )

    focusInto(element.current)

    expect(element.current).toHaveFocus()
  })

  it("should prefer checked radio buttons", () => {
    const element: Ref<HTMLInputElement> = { current: null }
    const props = { type: "radio", name: "group", onChange: vi.fn() }
    render(
      <div ref={element}>
        <input {...props} value="1" />
        <input {...props} value="2" checked />
        <input {...props} value="3" />
      </div>
    )

    focusInto(element.current)

    expect(screen.getByRole("radio", { checked: true })).toHaveFocus()
  })
})

describe("Test hasFocusableChild", () => {
  it("should return true if container has focusable children", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button>1</button>
      </div>
    )
    expect(hasFocusableChild(element.current)).toBe(true)
  })

  it("should return false if container has no focusable children", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <button disabled>1</button>
      </div>
    )
    expect(hasFocusableChild(element.current)).toBe(false)
  })

  it("should ignore children within an container with inert", () => {
    const element: Ref<HTMLDivElement> = { current: null }
    render(
      <div ref={element}>
        <div inert>
          <button disabled>1</button>
        </div>
      </div>
    )
    expect(hasFocusableChild(element.current)).toBe(false)
  })
})
