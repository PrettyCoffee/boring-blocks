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
