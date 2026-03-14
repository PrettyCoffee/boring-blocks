import { Config } from "tailwindcss"

import boring from "../tailwind"

export default {
  presets: [boring.getTailwindPreset()],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Quicksand"],
      body: ["Quicksand"],
      mono: ["Fira Code"],
    },
  },
} satisfies Config
