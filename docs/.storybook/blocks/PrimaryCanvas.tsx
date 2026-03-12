// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import { useOf, Canvas } from "@storybook/addon-docs/blocks"

type CanvasProps = Parameters<typeof Canvas>[0]
interface PrimaryCanvasProps extends Pick<CanvasProps, "sourceState"> {}

export const PrimaryCanvas = ({ ...canvasProps }: PrimaryCanvasProps) => {
  const { preparedMeta } = useOf("meta", ["meta"])
  const { primarySource } = preparedMeta.parameters
  const code = typeof primarySource === "string" ? primarySource : undefined

  return (
    <Canvas
      layout="fullscreen"
      source={{ code }}
      sourceState={code ? "shown" : "none"}
      {...canvasProps}
    />
  )
}
