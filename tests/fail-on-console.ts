import { beforeEach, afterEach } from "vitest"

const methods = [
  "error",
  "info",
  "log",
  "warn",
] satisfies (keyof typeof console)[]
type ConsoleMethod = (typeof methods)[number]
type ConsoleCallStacks = { message: string; stack: string }[]

const color = (() => {
  const reset = "\u001b[0m"
  const colors = {
    red: "\u001b[31m",
    cyan: "\u001b[36m",
    green: "\u001b[32m",
    gray: "\u001b[90m",
  } as const

  const colored = Object.fromEntries(
    Object.entries(colors).map(([name, color]) => [
      name,
      (message: string) => color + message + reset,
    ])
  )

  type Color = keyof typeof colors
  type ColorFn = (typeof colored)[string]
  return Object.assign(colored as Record<Color, ColorFn>, { reset })
})()

const isPlainObject = (value: unknown) =>
  Object.getPrototypeOf(value) === Object.getPrototypeOf({})

const stringifyObject = (obj: object, replacer: (value: unknown) => string) => {
  if (Array.isArray(obj)) return `[${obj.map(replacer).join(", ")}]`
  if (!isPlainObject(obj)) return `[${obj.constructor.name}]`
  const props = Object.entries(obj).map(
    ([key, value]) => `"${key}": ${replacer(value)}`
  )
  return `{ ${props.join(", ")} }`
}

const stringify = (arg: unknown): string => {
  try {
    switch (typeof arg) {
      case "function":
        return arg.toString()
      case "object":
        if (!arg) return "null"
        return stringifyObject(arg, value =>
          typeof value === "string" ? `"${value}"` : stringify(value)
        )
      default:
        return String(arg)
    }
  } catch {
    return color.red("[unparseable console arg]")
  }
}

const formatMessage = (...args: unknown[]) => args.map(stringify).join(" ")

const errorMessage = (methodName: ConsoleMethod) => {
  const console = color.green(`"console.${methodName}()"`)
  const mock = color.green(
    `"vi.spyOn(console, '${methodName}').mockImplementation(() => {})"`
  )
  return `${color.reset}Expected test not to call ${console}.\n       If that was expected, properly test it with ${mock}.`
}
const throwIfCalled = (
  methodName: ConsoleMethod,
  consoleCalls: ConsoleCallStacks
) => {
  if (consoleCalls.length === 0) return
  const messages = consoleCalls.map(({ message, stack }) =>
    [color.red(message), color.gray(stack)].join("\n")
  )
  throw new Error(`${errorMessage(methodName)}\n\n${messages.join("\n\n")}\n\n`)
}

const patchConsoleMethod = (methodName: ConsoleMethod) => {
  const originalMethod = console[methodName]
  let consoleCalls: ConsoleCallStacks = []

  const patched = (...args: unknown[]) => {
    // Preserve callstack for later use.
    // eslint-disable-next-line unicorn/error-message
    const { stack } = new Error()
    if (!stack) return
    consoleCalls.push({
      message: formatMessage(...args),
      stack: stack.split("\n").slice(2).join("\n"),
    })
  }

  beforeEach(() => {
    console[methodName] = patched
    consoleCalls = []
  })

  afterEach(() => {
    throwIfCalled(methodName, consoleCalls)
    console[methodName] = originalMethod
  })
}

export const failOnConsole = () => {
  methods.forEach(patchConsoleMethod)
}
