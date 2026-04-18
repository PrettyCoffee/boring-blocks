import { describe, expect, it } from "vitest"

import { renderHook } from "test"

import { useLatest } from "./use-latest"

describe("Test useLatest", () => {
  const initial = { value: 1 }
  const next = { value: 2 }

  it("updates to latest value", () => {
    const { rerender, result } = renderHook(useLatest, {
      initialProps: initial,
    })
    expect(result.current.current).toBe(initial)

    rerender(next)
    expect(result.current.current).toBe(next)
  })
})
