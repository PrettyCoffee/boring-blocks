import { DOCS_PREPARED, STORY_PREPARED } from "storybook/internal/core-events"
import { addons, types } from "storybook/manager-api"

import { darkMode } from "./darkMode"
import { DarkModeToggle } from "./DarkModeToggle"
import { type ThemeModes, theme } from "./theme"

const ADDON_NAME = "dark-mode-addon"
const PARAMETER_NAME = "themes"

const applyCurrentTheme = () => theme.applyToStorybook(darkMode.get())

applyCurrentTheme()

addons.register(ADDON_NAME, api => {
  darkMode.subscribe(applyCurrentTheme)

  const onParametersLoaded = () => {
    const themes = api.getCurrentParameter<ThemeModes>(PARAMETER_NAME)
    theme.setThemes(themes)
    applyCurrentTheme()
  }
  // Sync stored themes with themes from parameters
  const channel = addons.getChannel()
  channel.on(DOCS_PREPARED, onParametersLoaded)
  channel.on(STORY_PREPARED, onParametersLoaded)

  // Add dark mode toggle to Storybook toolbar
  addons.add(ADDON_NAME, {
    title: "Dark Mode",
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: DarkModeToggle,
  })
})
