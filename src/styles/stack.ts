import { type VariantProps, cva } from "class-variance-authority"

const stack = cva("", {
  variants: {
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      8: "gap-8",
    },
  },
  defaultVariants: {
    inline: false,
  },
})

type StackProps = Omit<VariantProps<typeof stack>, "direction">

export const vstack = (props?: StackProps) =>
  stack({ direction: "column", ...props })

export const hstack = (props?: StackProps) =>
  stack({ direction: "row", ...props })
