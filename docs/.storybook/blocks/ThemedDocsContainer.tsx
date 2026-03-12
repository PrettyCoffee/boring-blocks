// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import { type PropsWithChildren, useMemo } from "react"

import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks"

import { useDarkMode } from "../addons/dark-mode"
import { darkTheme, lightTheme } from "../themes"

export const ThemedDocsContainer = ({
  theme,
  ...rest
}: PropsWithChildren<DocsContainerProps>) => {
  const isDarkMode = useDarkMode()
  const userTheme = useMemo(
    () => ({
      ...theme,
      ...(isDarkMode ? darkTheme : lightTheme),
    }),
    [theme, isDarkMode]
  )

  return <DocsContainer {...rest} theme={userTheme} />
}
