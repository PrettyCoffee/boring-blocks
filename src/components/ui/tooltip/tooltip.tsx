import { type PropsWithChildren, type ReactNode } from "react"

import { type Placement } from "@floating-ui/react"

import { surface } from "../../../styles/surface"
import { zIndex } from "../../../styles/z-index"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { TooltipPrimitive } from "../../primitive/tooltip-primitive"
import { ErrorBoundary } from "../../utility/error-boundary"

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
        duration={150}
        className={cn(
          zIndex.tooltip,
          "*:duration-150 *:fill-mode-forwards",
          "data-close:*:animate-out data-close:*:fade-out-0 data-close:*:zoom-out-50 data-open:*:animate-in data-open:*:fade-in-0 data-open:*:zoom-in-50"
        )}
      >
        <div
          className={cn(
            surface({ look: "overlay", size: "md" }),
            "pointer-events-none overflow-hidden px-3 py-1.5 text-sm",
            className
          )}
        >
          {children}
        </div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </ErrorBoundary>
)
