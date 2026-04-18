import { describe, expect, it } from "vitest"

import { thenable } from "./thenable"

describe("thenable", () => {
  it("should resolve synchronously with the value", () => {
    let result = 0
    thenable(42).then(value => (result = value))
    expect(result).toBe(42)
  })

  it("should handle onfulfilled callback", async () => {
    const result = thenable(42).then(value => value * 2)
    expect(await result).toBe(84)
  })

  it("should chain then calls", async () => {
    const result = await thenable(42)
      .then(value => value * 2)
      .then(value => value + 10)
    expect(result).toBe(94)
  })

  it("should handle promise values", async () => {
    const result = thenable(Promise.resolve(42))
    expect(await result).toBe(42)
  })

  it("should handle errors", async () => {
    const result = thenable(42).then(
      () => {
        throw new Error("test error")
      },
      (error: unknown) => (error as Error).message
    )
    expect(await result).toBe("test error")
  })
})
