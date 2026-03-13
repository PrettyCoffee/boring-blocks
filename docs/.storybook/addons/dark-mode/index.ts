import { darkMode } from "./darkMode"
import { useAtom } from "../../../src/lib/yaasl"

export const useDarkMode = () => useAtom(darkMode)
