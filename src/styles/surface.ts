import { cva } from "class-variance-authority"

export const surface = cva("outline-[1.5px] outline-offset-[-.5px]", {
  variants: {
    look: {
      card: "rounded-lg bg-background shade-low outline-max-invert/5",
      overlay:
        "text-text shade-low outline-max-invert/10 backdrop-blur-xs bgl-base-invert/75",
    },
    size: {
      md: "rounded-md p-2",
      lg: "rounded-lg p-4",
    },
  },
})
