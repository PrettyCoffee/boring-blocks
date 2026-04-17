import { describe, expect, it } from "vitest"

import { render, screen } from "test"

import { CircleIcon } from "../icons"
import { Icon } from "./icon"

describe("Test Icon", () => {
  it("Renders an icon", () => {
    render(<Icon icon={CircleIcon} />)
    expect(screen.getIconByName("Circle")).toBeInTheDocument()
  })
})
