import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { renderHook } from "test"

import { useDebounce } from "./use-debounce"

describe("Test useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it("does not call function immediately", () => {
    const fn = vi.fn()
    const { result } = renderHook(useDebounce, { initialProps: 100 })

    result.current(fn)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("debounces function calls by resetting the timer", () => {
    const fn = vi.fn()
    const { result } = renderHook(useDebounce, { initialProps: 100 })

    result.current(fn)
    vi.advanceTimersByTime(50)
    result.current(fn)
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()

    result.current(fn)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("executes only once after the final call", () => {
    const fn = vi.fn()
    const { result } = renderHook(useDebounce, { initialProps: 100 })

    result.current(fn)
    result.current(fn)
    result.current(fn)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("respects the delay parameter", () => {
    const fn = vi.fn()
    const { result } = renderHook(useDebounce, { initialProps: 250 })

    result.current(fn)

    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(150)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("allows manual clearing of debounced calls", () => {
    const fn = vi.fn()
    const { result } = renderHook(useDebounce, { initialProps: 100 })

    result.current(fn)
    result.current.clear()

    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })

  it("cleans up timeout on unmount", () => {
    const fn = vi.fn()
    const { result, unmount } = renderHook(useDebounce, { initialProps: 100 })

    result.current(fn)
    unmount()

    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })
})
