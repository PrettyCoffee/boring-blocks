// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import { type Decorator, type StoryContext } from "@storybook/react-vite"
import { css, Global, styled } from "storybook/theming"
import { useDarkMode } from "../addons/dark-mode"

const CanvasLayout = styled.div<{ background?: string }>(
  ({ background }) => [
    css`
      padding: 1rem;
      position: relative;
      isolation: isolate;
    `,
    background && { background }
  ]
)

interface Backgrounds {
  default: string
  values: Array<{ name: string; value: string }>
}

const getCanvasBackground = ({
  globals,
  parameters,
}: Partial<StoryContext>, isDarkMode: boolean) => {
  const { value: selected } = (globals?.["backgrounds"] ?? {}) as {
    value?: string
  }
  if (selected) return selected

  const { values } = parameters?.["backgrounds"] as Backgrounds
  const defaultName = isDarkMode ? "dark" : "light"
  const storyBackground = values.find(({ name }) => name === defaultName)?.value

  return storyBackground || "white"
}
export const CanvasDecorator: Decorator = (Story, context) => {
  const isDarkMode = useDarkMode()
  const background = getCanvasBackground(context, isDarkMode)
  const isDocsPage = context.viewMode === "docs"
  return (
    <CanvasLayout background={isDocsPage ? background : undefined}>
      <Story />
      {!isDocsPage &&
        <Global styles={{ ":root": { background } }} />
      }
  </CanvasLayout>
)}
