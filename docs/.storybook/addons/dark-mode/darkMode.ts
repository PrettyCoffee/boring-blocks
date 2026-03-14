import { createAtom, localStorage } from "../../../src/lib/yaasl"

const getPrefersDarkMode = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!globalThis.window) return true
  return globalThis.window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const darkMode = createAtom({
  name: "dark-mode",
  defaultValue: getPrefersDarkMode(),
  effects: [localStorage()],
})

const updateCssTheme = () => {
  const isDarkMode = darkMode.get()
  document.documentElement.classList.remove("dark", "light")
  document.documentElement.classList.add(isDarkMode ? "dark" : "light")
}

updateCssTheme()
darkMode.subscribe(updateCssTheme)
