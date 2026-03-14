import { Dispatch } from "react"

import {
  flip,
  Middleware,
  offset,
  Placement,
  shift,
  useClientPoint,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react"

export type TooltipPlacement = Placement | "cursor"

interface UseTooltipProps {
  open: boolean
  onOpenChange: Dispatch<boolean>
  placement: TooltipPlacement
}

interface TooltipConfig {
  placement: Placement
  middleware: Middleware[]
}

const getTooltipConfig = (placement: TooltipPlacement): TooltipConfig =>
  placement === "cursor"
    ? {
        placement: "right-start",
        middleware: [
          offset({ mainAxis: 8, crossAxis: 16 }),
          shift({ padding: 8 }),
          flip(),
        ],
      }
    : {
        placement,
        middleware: [offset({ mainAxis: 4 }), shift({ padding: 8 }), flip()],
      }

export const useTooltip = ({
  open,
  onOpenChange,
  placement,
}: UseTooltipProps) => {
  const config = getTooltipConfig(placement)

  const floating = useFloating({
    open,
    onOpenChange,
    middleware: config.middleware,
    placement: config.placement,
  })

  const { context, refs, floatingStyles } = floating

  const interactions = useInteractions([
    useClientPoint(context, { enabled: placement === "cursor" }),
    useHover(context),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: "tooltip" }),
  ])

  const transition = useTransitionStyles(context, {
    initial: { opacity: 0, transform: "scale(0.75)" },
    open: { opacity: 1, transform: "scale(1)" },
    close: { opacity: 0, transform: "scale(0.75)" },
    duration: 150,
  })

  const getTriggerProps: typeof interactions.getReferenceProps = props =>
    interactions.getReferenceProps({
      ...props,
      ref: refs.setReference,
    })

  const getFloatingProps: typeof interactions.getFloatingProps = props =>
    interactions.getFloatingProps({
      ...props,
      ref: refs.setFloating,
      style: { ...floatingStyles, ...props?.style },
    })

  const getTransitionProps: typeof interactions.getFloatingProps = props => ({
    ...props,
    style: { ...transition.styles, ...props?.style },
  })

  return {
    isMounted: transition.isMounted,
    getTriggerProps,
    getFloatingProps,
    getTransitionProps,
  }
}
