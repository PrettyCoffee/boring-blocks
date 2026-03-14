import { PropsWithChildren, ReactNode, useState } from "react"

import { FloatingPortal } from "@floating-ui/react"

import { TooltipPlacement, useTooltip } from "./use-tooltip"
import { surface } from "../../../styles/surface"
import { zIndex } from "../../../styles/z-index"
import { ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { Slot } from "../../utility/slot"

const tooltipStyles = cn(
  surface({ look: "overlay", size: "md" }),
  "pointer-events-none overflow-hidden px-3 py-1.5 text-sm",
  zIndex.tooltip
)

export interface TooltipProps extends ClassNameProp {
  trigger: ReactNode
  placement?: TooltipPlacement
}

export const Tooltip = ({
  placement = "cursor",
  trigger,
  children,
  className,
}: PropsWithChildren<TooltipProps>) => {
  const [open, setOpen] = useState(false)
  const { getTriggerProps, getFloatingProps, getTransitionProps, isMounted } =
    useTooltip({
      open,
      onOpenChange: setOpen,
      placement,
    })

  return (
    <>
      <Slot {...getTriggerProps()}>{trigger}</Slot>

      {isMounted && (
        <FloatingPortal>
          <div {...getFloatingProps({})}>
            <div
              {...getTransitionProps({
                className: cn(zIndex.tooltip, tooltipStyles, className),
              })}
            >
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
