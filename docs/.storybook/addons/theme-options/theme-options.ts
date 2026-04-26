import {
  theme,
  applyThemeOptions,
  type ThemeOptions,
} from "boring-blocks/theme"

import { createAtom, createDerived, localStorage } from "../../../src/lib/yaasl"
import { darkMode } from "../dark-mode/darkMode"

type ColorName =
  | "neutral"
  | keyof typeof theme.tokens.variants.dark.color.category

export const themeOptions = createAtom({
  name: "theme-options",
  defaultValue: {
    radius: theme.tokens.variants.dark.radius,
    accent: "rose" satisfies ColorName as ColorName,
    colored: false,
  },
  effects: [localStorage()],
})

const fullTheme = createDerived(({ get }): ThemeOptions => {
  const isDarkMode = get(darkMode)
  const { accent, radius, colored } = get(themeOptions)

  return { radius, accent, colored, mode: isDarkMode ? "dark" : "light" }
})

const updateCssTheme = () =>
  applyThemeOptions(document.documentElement, fullTheme.get())

updateCssTheme()
fullTheme.subscribe(updateCssTheme)
