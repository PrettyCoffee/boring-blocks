import { addons } from "storybook/manager-api"
import { themes, type ThemeVars } from "storybook/theming"

import { createAtom, localStorage } from "../../../src/lib/yaasl"

export interface ThemeModes {
  /** The dark theme for storybook */
  dark: Partial<ThemeVars>
  /** The light theme for storybook */
  light: Partial<ThemeVars>
}

const storedThemes = createAtom<ThemeModes>({
  name: "themes",
  defaultValue: { dark: {}, light: {} },
  effects: [localStorage()],
})

const applyToStorybook = (isDarkMode: boolean) => {
  const stored = storedThemes.get()
  const theme = isDarkMode
    ? { ...themes.dark, ...stored.dark }
    : { ...themes.light, ...stored.light }

  addons.setConfig({ theme })
}

export const theme = {
  setThemes: async (modes: ThemeModes) => {
    await storedThemes.didInit
    storedThemes.set(modes)
  },
  applyToStorybook,
}
