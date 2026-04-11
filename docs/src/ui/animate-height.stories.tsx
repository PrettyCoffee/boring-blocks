import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import { AnimateHeight, Button, hstack } from "boring-blocks"
import { cn } from "boring-blocks/utils"

import { Placeholder } from "../fragments/placeholder"
import { argType } from "../utils/arg-type"

const meta = {
  title: "Utility/AnimateHeight",
  component: AnimateHeight,
  argTypes: {
    duration: argType.number(),
    height: argType.enum("radio", ["auto", 0, 100, 200, 300]),
    onTransitionStart: argType.callback(),
    onTransitionEnd: argType.callback(),
  },
  args: {
    duration: 300,
    height: "auto",
  },
} satisfies Meta<typeof AnimateHeight>

export default meta

type Story = StoryObj<typeof meta>

const demoHeights: Record<
  string,
  { defautlValue?: number; values?: number[] }
> = {
  auto: {},
  number: { defautlValue: 150, values: [0, 100, 150, 200] },
  px: { defautlValue: 150, values: [0, 100, 150, 200] },
  rem: { defautlValue: 10, values: [0, 5, 10, 15] },
  vh: { defautlValue: 25, values: [0, 10, 25, 50] },
  "%": { defautlValue: 50, values: [0, 25, 50, 75, 100] },
}
export const Default: Story = {
  argTypes: { height: argType.disabled() },
  render: args => {
    const [selectedType, setSelectedType] = useState("number")
    const [heightValue, setHeightValue] = useState(100)
    const [contentHeight, setContentHeight] = useState<number | string>("100%")

    const heightOptions = demoHeights[selectedType]?.values ?? []

    const height =
      selectedType === "auto"
        ? "auto"
        : selectedType === "number"
          ? heightValue
          : heightValue + selectedType

    return (
      <>
        <div className={cn(hstack({ gap: 2, align: "center" }), "mb-2")}>
          Height type:
          {Object.keys(demoHeights).map(type => (
            <Button
              key={type}
              onClick={() => {
                setSelectedType(type)
                setHeightValue(demoHeights[type]?.defautlValue ?? 0)
                setContentHeight("100%")
              }}
              active={selectedType === type}
            >
              {type}
            </Button>
          ))}
        </div>

        {selectedType === "auto" ? (
          <div className={cn(hstack({ gap: 2, align: "center" }), "mb-2")}>
            Content Height:
            {[0, 100, 150, 200, "100%"].map(height => (
              <Button
                key={height}
                onClick={() => setContentHeight(height)}
                active={contentHeight === height}
              >
                {height}
              </Button>
            ))}
          </div>
        ) : (
          <div className={cn(hstack({ gap: 2, align: "center" }), "mb-2")}>
            Height value:
            {heightOptions.map(height => (
              <Button
                key={height}
                onClick={() => setHeightValue(height)}
                active={heightValue === height}
              >
                {height}
                {selectedType !== "number" && selectedType}
              </Button>
            ))}
          </div>
        )}

        <div className="mb-2 font-mono text-sm">{`height={${typeof height === "number" ? height : `"${height}"`}}`}</div>

        <div
          className={cn(
            selectedType === "%" &&
              "h-48 w-max outline outline-offset-1 outline-stroke-gentle"
          )}
        >
          <AnimateHeight
            {...args}
            height={height}
            className="w-96 p-2 outline outline-highlight"
          >
            <Placeholder style={{ height: contentHeight }} />
          </AnimateHeight>
        </div>
      </>
    )
  },
}
