import { describe, expect, it } from "vitest"

import { clamp } from "./clamp"

describe("Test clamp", () => {
  it.each`
    value | min  | max   | expected
    ${5}  | ${0} | ${10} | ${5}
    ${-5} | ${0} | ${10} | ${0}
    ${15} | ${0} | ${10} | ${10}
  `("should clamp $value to $min and $max", ({ value, min, max, expected }) => {
    expect(clamp(value, min, max)).toBe(expected)
  })
})
