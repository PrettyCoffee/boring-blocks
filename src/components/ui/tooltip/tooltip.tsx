import { type PropsWithChildren, type ReactNode } from "react"

import { type Placement } from "@floating-ui/react"

import { surface } from "../../../styles/surface"
import { zIndex } from "../../../styles/z-index"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { TooltipPrimitive } from "../../primitive/tooltip-primitive"
import { ErrorBoundary } from "../../utility/error-boundary"

const tooltipStyles = cn(
  surface({ look: "overlay", size: "md" }),
  "pointer-events-none overflow-hidden px-3 py-1.5 text-sm",
  zIndex.tooltip
)

export interface TooltipProps extends ClassNameProp {
  trigger: ReactNode
  placement?: "cursor" | Placement
}

export const Tooltip = ({
  placement = "cursor",
  trigger,
  children,
  className,
}: PropsWithChildren<TooltipProps>) => (
  <ErrorBoundary>
    <TooltipPrimitive.Root
      {...(placement === "cursor" ? { followCursor: true } : { placement })}
    >
      <TooltipPrimitive.Trigger>{trigger}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className={cn(zIndex.tooltip, tooltipStyles, className)}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </ErrorBoundary>
)
