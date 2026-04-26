import { theme } from "./theme"
import { parseOklch } from "./utils/color"

type ColorName =
  | "neutral"
  | keyof typeof theme.tokens.variants.dark.color.category

export interface ThemeOptions {
  radius: number
  mode: "dark" | "light"
  accent: ColorName
  colored: boolean
}

export const applyThemeOptions = (
  element: HTMLElement,
  options: ThemeOptions
) => {
  theme.set(element, "radius", options.radius)

  const isLight = options.mode === "light"
  const isDark = options.mode === "dark"
  element.classList.toggle("light", isLight)
  element.classList.toggle("dark", isDark)
  element.classList.toggle("light-with-accent", isLight && options.colored)
  element.classList.toggle("dark-with-accent", isDark && options.colored)

  const variant = isDark ? "dark" : "light"
  const tokens = theme.tokens.variants[variant]

  const accentColor =
    options.accent === "neutral"
      ? tokens.color.text.priority
      : tokens.color.category[options.accent]

  const { light, chroma, hue } = parseOklch(accentColor)
  theme.set(element, "color.accent", `${light} ${chroma} ${hue}`)
  theme.set(element, "color.accentHue", hue)
}
