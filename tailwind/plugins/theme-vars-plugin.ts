import plugin from "tailwindcss/plugin"

import { Theme } from "../../src/theme/create-theme"

function assertTheme(theme: unknown): asserts theme is Theme {
  if (theme instanceof Theme) return
  throw new Error(
    "A theme instance must be passed to the tailwind themeVarsPlugin"
  )
}

interface ThemeVarsPluginOptions {
  /** The theme that should be used. Must be created with `createTheme`. */
  theme?: Theme
  /** Merging strategy of the theme tokens.
   *  - "replace" will overwrite the original tailwind theme tokens
   *  - "extend" will add the tokens alongside to the tailwind theme tokens
   **/
  strategy?: "replace" | "extend"
}

interface NestedStringObject {
  [k: string]: NestedStringObject | string
}

export const themeVarsPlugin = plugin.withOptions<ThemeVarsPluginOptions>(
  ({ theme } = {}) => {
    assertTheme(theme)

    return api => {
      const css: NestedStringObject = {
        ":root": theme.getCssVars(),
      }
      Object.keys(theme.tokens.variants).forEach(variantName => {
        css[`.${variantName}`] = theme.getCssVars(variantName)
      })
      api.addBase(css)
    }
  },

  ({ theme, strategy } = {}) => {
    assertTheme(theme)

    if (strategy === "extend") return { theme: { extend: theme.values } }
    return { theme: theme.values }
  }
)
