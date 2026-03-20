import { type VariantProps, cva } from "class-variance-authority"

export const interactive = cva("cursor-pointer bgl-layer/0", {
  variants: {
    look: {
      key: "text-text-button bgl-base-background-button hover:bgl-layer-invert/15 active:bgl-layer-invert/25",
      ghost:
        "border border-stroke-button text-text bgl-base-transparent hover:bgl-layer/10 active:bgl-layer/15",
      flat: "text-text bgl-base-transparent hover:bgl-layer/10 active:bgl-layer/15",
      link: "text-text-priority underline-offset-4 hover:underline active:opacity-80",
      destructive:
        "border border-alert-error bg-alert-error/5 text-alert-error hover:bg-alert-error/15 active:bg-alert-error/20",
    },
    active: {
      false: "",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  compoundVariants: [
    {
      active: true,
      disabled: false,
      look: ["ghost", "flat", "link"],
      className: "border-highlight text-highlight",
    },
  ],
  defaultVariants: {
    look: "flat",
    active: false,
    disabled: false,
  },
})
export type InteractiveProps = Omit<
  VariantProps<typeof interactive>,
  "disabled"
>
