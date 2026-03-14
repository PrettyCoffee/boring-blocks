import { type Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

import { screens } from "./breakpoints"
import { theme } from "../src/theme"
import { bgLayerPlugin } from "./plugins/bg-layer-plugin"
import { themeVarsPlugin } from "./plugins/theme-vars-plugin"

export default {
  content: [`${import.meta.dirname}/../src/**/*.{ts,tsx}`],
  plugins: [
    animatePlugin,
    themeVarsPlugin({ theme, strategy: "replace" }),
    bgLayerPlugin({
      colors: {
        default: theme.read("color.background.invert"),
        invert: theme.read("color.background.default"),
      },
    }),
  ],
  darkMode: "selector",
  theme: {
    screens,
    extend: {
      transitionTimingFunction: {
        bounce: "cubic-bezier(.47,1.64,.41,.8)",
      },
    },
  },
} satisfies Config
