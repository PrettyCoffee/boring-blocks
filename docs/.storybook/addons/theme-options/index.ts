import { themeOptions } from "./theme-options"
import { useAtom } from "../../../src/lib/yaasl"

export const useThemeOptions = () => useAtom(themeOptions)
