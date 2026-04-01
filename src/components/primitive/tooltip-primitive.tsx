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
} from "@floating-ui/react"

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

  const transition = useTransitionStyles(floating.context, {
    initial: { opacity: 0, transform: "scale(0.75)" },
    open: { opacity: 1, transform: "scale(1)" },
    close: { opacity: 0, transform: "scale(0.75)" },
    duration: 150,
  })

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
  }, [
    floating.floatingStyles,
    floating.refs.setFloating,
    floating.refs.setReference,
    interactions,
    transition.isMounted,
    transition.styles,
  ])
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
  outerClassName,
  innerClassName,
}: PropsWithChildren<{ innerClassName?: string; outerClassName?: string }>) => {
  const { getFloatingProps, getTransitionProps, isMounted } =
    Context.useRequiredValue()

  if (!isMounted) return null

  return (
    <FloatingPortal>
      <div {...getFloatingProps({ className: outerClassName })}>
        <div
          {...getTransitionProps({
            className: innerClassName,
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
