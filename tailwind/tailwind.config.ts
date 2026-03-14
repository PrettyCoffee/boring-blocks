import { type Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

import { screens } from "./breakpoints"
import { theme } from "../src/theme"
import { bgLayerPlugin } from "./plugins/bg-layer-plugin"
import { shadowPlugin } from "./plugins/shadow-plugin"
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
    shadowPlugin({
      colors: {
        default: `color-mix(in srgb, ${theme.read("color.shadow")} 25%, transparent)`,
      },
    }),
  ],
  darkMode: "selector",
  theme: {
    screens,

    // Remove default shadows
    boxShadow: {},
    boxShadowColor: {},

    extend: {
      transitionTimingFunction: {
        bounce: "cubic-bezier(.47,1.64,.41,.8)",
      },
    },
  },
} satisfies Config
