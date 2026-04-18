import { describe, expect, it, vi } from "vitest"

import { mergeRefs } from "./merge-refs"

describe("Test mergeRefs", () => {
  it("should call function refs with correct value", () => {
    const value = { test: "value" }
    const ref1 = vi.fn()
    const ref2 = vi.fn()

    mergeRefs(ref1, ref2)(value)

    expect(ref1).toHaveBeenCalledWith(value)
    expect(ref2).toHaveBeenCalledWith(value)
  })

  it("should set current on object refs", () => {
    const value = { test: "value" }
    const ref1 = { current: null }
    const ref2 = { current: null }

    mergeRefs<null | typeof value>(ref1, ref2)(value)

    expect(ref1.current).toBe(value)
    expect(ref2.current).toBe(value)
  })

  it("should handle mixed function and object refs", () => {
    const value = { test: "value" }
    const fnRef = vi.fn()
    const objRef = { current: null }

    mergeRefs(fnRef, objRef)(value)

    expect(fnRef).toHaveBeenCalledWith(value)
    expect(objRef.current).toBe(value)
  })

  it("should handle null and undefined refs mixed in", () => {
    const fnRef = vi.fn()
    const value = "test"
    mergeRefs(null, fnRef, undefined)(value)
    expect(fnRef).toHaveBeenCalledWith(value)
  })

  it("should handle setting null value", () => {
    const ref1 = { current: "initial" }
    const ref2 = { current: "initial" }
    mergeRefs(ref1, ref2)(null)
    expect(ref1.current).toBeNull()
    expect(ref2.current).toBeNull()
  })
})
