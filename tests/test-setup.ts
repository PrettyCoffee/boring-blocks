import "@testing-library/jest-dom/vitest"
import "temporal-polyfill/global"

import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

import { failOnConsole } from "./fail-on-console"

failOnConsole()

afterEach(() => {
  cleanup()
})
