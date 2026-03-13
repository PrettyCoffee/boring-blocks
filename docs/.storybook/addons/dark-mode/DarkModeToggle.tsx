// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import { MoonIcon, SunIcon } from "@storybook/icons"
import { IconButton } from "storybook/internal/components"

import { darkMode } from "./darkMode"
import { useAtom } from "../../../src/lib/yaasl"

export const DarkModeToggle = () => {
  const isDarkMode = useAtom(darkMode)

  return (
    <IconButton
      key="dark-mode-toggle"
      title={
        isDarkMode ? "Change theme to light mode" : "Change theme to dark mode"
      }
      onClick={() => darkMode.set(!isDarkMode)}
    >
      {isDarkMode ? (
        <SunIcon aria-hidden="true" />
      ) : (
        <MoonIcon aria-hidden="true" />
      )}
    </IconButton>
  )
}
