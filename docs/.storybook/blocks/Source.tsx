// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import {
  type SourceProps,
  Source as StorybookSource,
} from "@storybook/addon-docs/blocks"

import { extractFromFile } from "../../src/utils/extractFromFile"
import { useDarkMode } from "../addons/dark-mode"

interface ExtendedSourceProps extends Pick<SourceProps, "language"> {
  code: string
  tagId?: string
}

export const Source = ({
  code,
  tagId,
  language = "tsx",
}: ExtendedSourceProps) => {
  const isDarkMode = useDarkMode()
  return (
    <StorybookSource
      code={extractFromFile(code, tagId)}
      language={language}
      dark={isDarkMode}
    />
  )
}
