import { useAtom } from "@yaasl/react"

import { darkMode } from "./darkMode"

export const useDarkMode = () => useAtom(darkMode)
