// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React, { type ComponentProps } from "react"

import { useOf, Canvas } from "@storybook/addon-docs/blocks"

type CanvasProps = ComponentProps<typeof Canvas>
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
