import { theme } from "boring-blocks/theme"

import { createAtom, createDerived, localStorage } from "../../../src/lib/yaasl"
import { darkMode } from "../dark-mode/darkMode"

type ColorName = keyof typeof theme.tokens.variants.dark.color.category

export const themeOptions = createAtom({
  name: "theme-options",
  defaultValue: {
    radius: theme.tokens.variants.dark.radius,
    accent: "rose" satisfies ColorName as ColorName,
  },
  effects: [localStorage()],
})

const fullTheme = createDerived(({ get }) => {
  const isDarkMode = get(darkMode)
  const { accent, radius } = get(themeOptions)
  const colors =
    theme.tokens.variants[isDarkMode ? "dark" : "light"].color.category
  const accentColor = colors[accent]

  return { radius, accentName: accent, accentColor }
})

const updateCssTheme = () => {
  const { radius, accentColor } = fullTheme.get()

  theme.set(document.documentElement, "radius", radius as never)
  theme.set(
    document.documentElement,
    "color.accent",
    accentColor.replace(/^oklch\(([^)]*)\)$/, "$1") as never
  )
}

updateCssTheme()
fullTheme.subscribe(updateCssTheme)
