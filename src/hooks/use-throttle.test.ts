import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { renderHook } from "test"

import { useThrottle } from "./use-throttle"

describe("Test useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it("calls function immediately the first time", () => {
    const fn = vi.fn()
    const { result } = renderHook(useThrottle, { initialProps: 100 })

    result.current(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("throttles function calls", () => {
    const fn = vi.fn()
    const { result } = renderHook(useThrottle, { initialProps: 100 })

    result.current(fn)
    result.current(fn)
    result.current(fn)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("executes immediately if enough time has passed", () => {
    const fn = vi.fn()
    const { result } = renderHook(useThrottle, { initialProps: 100 })

    result.current(fn)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    result.current(fn)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("respects the delay parameter", () => {
    const fn = vi.fn()
    const { result } = renderHook(useThrottle, { initialProps: 250 })

    result.current(fn)
    result.current(fn)
    result.current(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(150)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("allows manual clearing of throttled calls", () => {
    const fn = vi.fn()
    const { result } = renderHook(useThrottle, { initialProps: 100 })

    result.current(fn)
    result.current(fn)

    result.current.clear()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("cleans up timeout on unmount", () => {
    const fn = vi.fn()
    const { result, unmount } = renderHook(useThrottle, { initialProps: 100 })

    result.current(fn)
    result.current(fn)
    result.current(fn)

    unmount()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
