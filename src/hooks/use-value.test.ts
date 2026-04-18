import { describe, expect, it, vi } from "vitest"

import { act, renderHook } from "test"

import { useValue } from "./use-value"

const defaultValue = "default"
const initialValue = "initial"
const controlledValue = "controlled"
const nextValue = "next"

const emptyProps = {
  defaultValue,
  controlledValue: undefined,
  initialValue: undefined,
  onChange: undefined,
}

describe("Test useValue", () => {
  describe("uncontrolled", () => {
    it("uses defaultValue by default", () => {
      const { result } = renderHook(useValue, {
        initialProps: emptyProps,
      })
      expect(result.current[0]).toBe(defaultValue)
    })

    it("uses initialValue over defaultValue", () => {
      const { result } = renderHook(useValue, {
        initialProps: { ...emptyProps, initialValue },
      })
      expect(result.current[0]).toBe(initialValue)
    })

    it("doesn't update on rerender", () => {
      const { result, rerender } = renderHook(useValue, {
        initialProps: { ...emptyProps, initialValue },
      })
      expect(result.current[0]).toBe(initialValue)
      rerender({ ...emptyProps, initialValue: nextValue })
      expect(result.current[0]).toBe(initialValue)
    })

    it("updates internal state", () => {
      const { result } = renderHook(useValue, {
        initialProps: { ...emptyProps, initialValue },
      })

      expect(result.current[0]).toBe(initialValue)
      act(() => result.current[1](nextValue))
      expect(result.current[0]).toBe(nextValue)
    })

    it("calls onChange", () => {
      const onChange = vi.fn()
      const { result } = renderHook(useValue, {
        initialProps: {
          ...emptyProps,
          initialValue,
          onChange,
        },
      })

      result.current[1](nextValue)
      expect(onChange).toHaveBeenCalledWith(nextValue, undefined)
    })

    it("handles function updater", () => {
      const { result } = renderHook(useValue, {
        initialProps: {
          ...emptyProps,
          defaultValue: 0,
          initialValue: 5,
        },
      })

      expect(result.current[0]).toBe(5)
      act(() => result.current[1](prev => prev * 2))
      expect(result.current[0]).toBe(10)
    })
  })

  describe("controlled", () => {
    it("uses controlledValue over initialValue or defaultValue", () => {
      const { result } = renderHook(useValue, {
        initialProps: { ...emptyProps, initialValue, controlledValue },
      })
      expect(result.current[0]).toBe(controlledValue)
    })

    it("updates on controlled change", () => {
      const { result, rerender } = renderHook(useValue, {
        initialProps: { ...emptyProps, controlledValue },
      })
      expect(result.current[0]).toBe(controlledValue)
      rerender({ ...emptyProps, controlledValue: nextValue })
      expect(result.current[0]).toBe(nextValue)
    })

    it("calls onChange", () => {
      const onChange = vi.fn()
      const { result } = renderHook(useValue, {
        initialProps: {
          ...emptyProps,
          initialValue,
          controlledValue,
          onChange,
        },
      })

      result.current[1](nextValue)
      expect(onChange).toHaveBeenCalledWith(nextValue, undefined)
      expect(result.current[0]).toBe(controlledValue)
    })
  })

  describe("with event", () => {
    it("passes event to onChange", () => {
      const onChange = vi.fn()
      const { result } = renderHook(useValue<string, string, Event>, {
        initialProps: {
          ...emptyProps,
          onChange,
        },
      })

      const mockEvent = new Event("change")
      result.current[1](nextValue, mockEvent)
      expect(onChange).toHaveBeenCalledWith(nextValue, mockEvent)
    })
  })
})
