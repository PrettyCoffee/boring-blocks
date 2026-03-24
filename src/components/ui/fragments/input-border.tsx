import { type PropsWithChildren, type HTMLProps } from "react"

import { alert as alertStyles } from "../../../styles/alert"
import { hstack } from "../../../styles/stack"
import { type AlertKind } from "../../../types/alert"
import { cn } from "../../../utils/cn"

type DivProps = HTMLProps<HTMLDivElement>
export interface NumberInputProps extends Pick<
  DivProps,
  "ref" | "style" | "className"
> {
  alert?: AlertKind
}
export const InputBorder = ({
  alert,
  className,
  children,
  ...props
}: PropsWithChildren<NumberInputProps>) => (
  <div
    {...props}
    className={cn(
      hstack({ inline: true, align: "center", justify: "center" }),
      "relative h-10 w-full rounded-md border",
      alert && ["warn", "error"].includes(alert)
        ? alertStyles[alert].border
        : "border-stroke-muted hover:border-stroke [&:has(*:focus-visible)]:border-stroke-focus",
      className
    )}
  >
    {children}
  </div>
)
