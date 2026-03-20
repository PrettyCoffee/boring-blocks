import { type Dispatch, type PropsWithChildren, useState } from "react"

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

  const { context, refs, floatingStyles } = floating

  const interactions = useInteractions([
    useClientPoint(context, { enabled: followCursor === true }),
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
  className,
}: PropsWithChildren<ClassNameProp>) => {
  const { getFloatingProps, getTransitionProps, isMounted } =
    Context.useRequiredValue()

  if (!isMounted) return null

  return (
    <FloatingPortal>
      <div {...getFloatingProps({})}>
        <div
          {...getTransitionProps({
            className,
          })}
        >
          {children}
        </div>
      </div>
    </FloatingPortal>
  )
}

export const TooltipPrimitive = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
}
