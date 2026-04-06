import { addons, types } from "storybook/manager-api"

import { ThemeOptionToolbar } from "./theme-option-toolbar"

const ADDON_NAME = "theme-options-addon"

addons.register(ADDON_NAME, () => {
  addons.add(ADDON_NAME, {
    title: "Theme Options",
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: ThemeOptionToolbar,
  })
})
