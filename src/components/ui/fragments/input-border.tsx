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
  hoverClassName?: string
  focusVisibleClassName?: string
}
export const InputBorder = ({
  alert,
  className,
  children,
  hoverClassName = cn("hover:border-stroke"),
  focusVisibleClassName = cn("[&:has(*:focus-visible)]:border-stroke-focus"),
  ...props
}: PropsWithChildren<NumberInputProps>) => (
  <div
    {...props}
    className={cn(
      hstack({ inline: true, align: "center", justify: "center" }),
      "relative h-10 w-full rounded-md border in-[table_tr:not(:hover),[role='grid']_[role='row']:not(:hover)]:border-transparent",
      alert && ["warn", "error"].includes(alert)
        ? alertStyles[alert].border
        : [`border-stroke-muted`, hoverClassName, focusVisibleClassName],
      className
    )}
  >
    {children}
  </div>
)
