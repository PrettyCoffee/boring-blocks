import { cva } from "class-variance-authority"

export const surface = cva("border", {
  variants: {
    look: {
      card: "rounded-lg border-stroke-muted bg-background shade-low",
      overlay:
        "border-text-gentle/25 text-text shade-low backdrop-blur-md bgl-base-max",
    },
    size: {
      md: "rounded-md p-2",
      lg: "rounded-lg p-4",
    },
  },
})
