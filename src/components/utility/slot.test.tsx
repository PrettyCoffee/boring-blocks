import { describe, expect, it, vi } from "vitest"

import { render, screen } from "test"

import { Slot } from "./slot"

describe("Test Slot", () => {
  describe("only allows one react element child", () => {
    it("should render children", () => {
      render(
        <Slot>
          <button>test</button>
        </Slot>
      )
      expect(screen.getByRole("button", { name: "test" })).toBeInTheDocument()
    })

    it.each`
      name                         | children
      ${"null"}                    | ${null}
      ${"string"}                  | ${"text"}
      ${"multiple react elements"} | ${[<button key="1">1</button>, <button key="2">2</button>]}
    `("should throw an error if children is $name", ({ children }) => {
      // eslint-disable-next-line vitest/no-alias-methods
      expect(() => render(<Slot>{children}</Slot>)).toThrow(
        "Slot requires a single React element as child."
      )
    })
  })

  describe("merges props correctly", () => {
    it.each`
      description                       | slotRef              | childRef
      ${"slot and child ref functions"} | ${vi.fn()}           | ${vi.fn()}
      ${"slot and child ref objects"}   | ${{ current: null }} | ${{ current: null }}
    `("should allow $description", ({ slotRef, childRef }) => {
      render(
        <Slot ref={slotRef}>
          <button ref={childRef}>test</button>
        </Slot>
      )
      /* eslint-disable vitest/no-conditional-expect -- reduces test boilerplate */
      if (slotRef) {
        if (typeof slotRef === "function") expect(slotRef).toHaveBeenCalled()
        if (typeof slotRef === "object") expect(slotRef.current).not.toBeNull()
      }
      if (childRef) {
        if (typeof childRef === "function") expect(childRef).toHaveBeenCalled()
        if (typeof childRef === "object")
          expect(childRef.current).not.toBeNull()
      }
      /* eslint-enable */
    })

    it("merges className props correctly", () => {
      render(
        <Slot className="size-10">
          <button className="border border-stroke">test</button>
        </Slot>
      )
      expect(screen.getByRole("button")).toHaveClass(
        "border border-stroke size-10"
      )
    })

    it("merges style props correctly", () => {
      const slotStyles = { color: "red", fontSize: "16px" }
      const childStyles = { backgroundColor: "blue", fontSize: "12px" }
      render(
        <Slot style={slotStyles}>
          <button style={childStyles}>test</button>
        </Slot>
      )
      expect(screen.getByRole("button")).toHaveStyle({
        ...slotStyles,
        ...childStyles,
      })
    })

    it("merges event handler props correctly", async () => {
      const slotFn = vi.fn()
      const childFn = vi.fn()
      const { user } = render(
        <Slot onClick={slotFn}>
          <button onClick={childFn}>test</button>
        </Slot>
      )
      const button = screen.getByRole("button")
      expect(slotFn).not.toHaveBeenCalled()
      expect(childFn).not.toHaveBeenCalled()

      await user.click(button)
      expect(slotFn).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ type: "click" })
      )
      expect(childFn).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ type: "click" })
      )
    })
  })
})
