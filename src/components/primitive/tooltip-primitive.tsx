import { type Dispatch, type PropsWithChildren, useMemo, useState } from "react"

import {
  flip,
  FloatingPortal,
  offset,
  type OffsetOptions,
  type Placement,
  useClientPoint,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
  type UseTransitionStylesProps,
} from "@floating-ui/react"

import { type ClassNameProp } from "../../types/base-props"
import { createContext } from "../../utils/create-context"
import { Slot } from "../utility/slot"

interface UseTooltipProps {
  open: boolean
  onOpenChange: Dispatch<boolean>
  followCursor?: boolean
  placement?: Placement
  offset?: OffsetOptions
}

interface TooltipConfig {
  placement: Placement
  offset: OffsetOptions
}

const getTooltipConfig = (
  placement?: Placement,
  followCursor?: boolean
): TooltipConfig =>
  followCursor
    ? {
        placement: placement ?? "right-start",
        offset: { mainAxis: 12, crossAxis: 16 },
      }
    : {
        placement: placement ?? "right",
        offset: { mainAxis: 4 },
      }

export const useTooltip = ({
  open,
  onOpenChange,
  followCursor,
  placement,
  offset: offsetProp,
}: UseTooltipProps) => {
  const config = getTooltipConfig(placement, followCursor)

  const floating = useFloating({
    open,
    onOpenChange,
    middleware: [offset(offsetProp ?? config.offset), flip()],
    placement: config.placement,
  })

  const interactions = useInteractions([
    useClientPoint(floating.context, { enabled: followCursor === true }),
    useHover(floating.context),
    useFocus(floating.context),
    useDismiss(floating.context),
    useRole(floating.context, { role: "tooltip" }),
  ])

  return useMemo(() => {
    const getTriggerProps: typeof interactions.getReferenceProps = props =>
      interactions.getReferenceProps({
        ...props,
        ref: floating.refs.setReference,
      })

    const getFloatingProps: typeof interactions.getFloatingProps = props =>
      interactions.getFloatingProps({
        ...props,
        ref: floating.refs.setFloating,
        style: { ...floating.floatingStyles, ...props?.style },
      })

    return {
      floating,
      getTriggerProps,
      getFloatingProps,
    }
  }, [floating, interactions])
}

const Context = createContext<ReturnType<typeof useTooltip>>("Tooltip")

interface TooltipRootProps extends Pick<
  UseTooltipProps,
  "followCursor" | "placement" | "offset"
> {}
const TooltipRoot = ({
  followCursor,
  placement,
  offset,
  children,
}: PropsWithChildren<TooltipRootProps>) => {
  const [open, setOpen] = useState(false)
  const tooltip = useTooltip({
    open,
    onOpenChange: setOpen,
    followCursor,
    placement,
    offset,
  })

  return <Context value={tooltip}>{children}</Context>
}

const TooltipTrigger = ({ children }: PropsWithChildren) => {
  const { getTriggerProps } = Context.useRequiredValue()
  return <Slot {...getTriggerProps()}>{children}</Slot>
}

const TooltipContent = ({
  children,
  duration,
  className,
}: PropsWithChildren<
  ClassNameProp & {
    duration?: UseTransitionStylesProps["duration"]
  }
>) => {
  const { getFloatingProps, floating } = Context.useRequiredValue()
  const transition = useTransitionStyles(floating.context, { duration })

  if (!transition.isMounted) return null
  return (
    <FloatingPortal>
      <div
        {...getFloatingProps()}
        className={className}
        data-open={floating.context.open ? "true" : undefined}
        data-close={!floating.context.open ? "true" : undefined}
      >
        {children}
      </div>
    </FloatingPortal>
  )
}

export const TooltipPrimitive = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
}
