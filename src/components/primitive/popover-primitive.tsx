import {
  useState,
  useMemo,
  useLayoutEffect,
  type PropsWithChildren,
  type HTMLProps,
  type ComponentProps,
} from "react"

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  type Placement,
  FloatingPortal,
  FloatingFocusManager,
  useId,
  useTransitionStyles,
  type UseTransitionStylesProps,
} from "@floating-ui/react"

import { useValue } from "../../hooks/use-value"
import { type ClassNameProp } from "../../types/base-props"
import { createContext } from "../../utils/create-context"
import { mergeRefs } from "../../utils/merge-refs"
import { Slot } from "../utility/slot"

interface PopoverOptions {
  placement: Placement
  open?: boolean
  initialOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const usePopover = ({
  placement,
  open: controlledOpen,
  initialOpen,
  onOpenChange,
}: PopoverOptions) => {
  const [labelId, setLabelId] = useState<string | undefined>()
  const [descriptionId, setDescriptionId] = useState<string | undefined>()

  const [open, setOpen] = useValue({
    controlledValue: controlledOpen,
    initialValue: initialOpen,
    defaultValue: false,
    onChange: onOpenChange,
  })

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 4,
      }),
      shift({ padding: 4 }),
    ],
  })

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context),
    useRole(floating.context, { role: "dialog" }),
  ])

  return useMemo(() => {
    const getTriggerProps: typeof interactions.getReferenceProps = props =>
      interactions.getReferenceProps({
        ...props,
        ref: floating.context.refs.setReference,
      })

    const getFloatingProps: typeof interactions.getFloatingProps = props =>
      interactions.getFloatingProps({
        ...props,
        "aria-labelledby": labelId,
        "aria-describedby": descriptionId,
        ref: mergeRefs(floating.context.refs.setFloating, props?.ref),
        style: { ...floating.context.floatingStyles, ...props?.style },
      })

    return {
      floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      getTriggerProps,
      getFloatingProps,
    }
  }, [
    floating,
    interactions,
    descriptionId,
    labelId,
    setDescriptionId,
    setLabelId,
  ])
}

const PopoverContext =
  createContext<ReturnType<typeof usePopover>>("PopoverPrimitive")

const PopoverPrimitiveRoot = ({
  children,
  ...options
}: PropsWithChildren<PopoverOptions>) => {
  const popover = usePopover({ ...options })
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  )
}

const PopoverPrimitiveTrigger = ({ children, ...props }: PropsWithChildren) => {
  const { getTriggerProps } = PopoverContext.useRequiredValue()
  return <Slot {...getTriggerProps(props)}>{children}</Slot>
}

const PopoverPrimitiveContent = ({
  children,
  duration,
  ...props
}: PropsWithChildren<
  ClassNameProp & Pick<UseTransitionStylesProps, "duration">
>) => {
  const { getFloatingProps, floating } = PopoverContext.useRequiredValue()
  const transition = useTransitionStyles(floating.context, { duration })

  if (!transition.isMounted) return null
  return (
    <FloatingPortal preserveTabOrder>
      <FloatingFocusManager context={floating.context} modal={false}>
        <div
          {...getFloatingProps(props)}
          data-side={floating.context.placement.split("-")[0]}
          data-open={floating.context.open ? "true" : undefined}
          data-close={!floating.context.open ? "true" : undefined}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
}

const PopoverPrimitiveTitle = ({
  children,
  ...props
}: HTMLProps<HTMLHeadingElement>) => {
  const { setLabelId } = PopoverContext.useRequiredValue()
  const id = useId()

  // Only set `aria-labelledby` if this component is used
  useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [id, setLabelId])

  return (
    <h2 {...props} id={id}>
      {children}
    </h2>
  )
}

const PopoverPrimitiveDescription = (
  props: HTMLProps<HTMLParagraphElement>
) => {
  const { setDescriptionId } = PopoverContext.useRequiredValue()
  const id = useId()

  // Only set `aria-describedby` if this component is used
  useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [id, setDescriptionId])

  return <p {...props} id={id} />
}

const PopoverPrimitiveClose = ({ ...props }: PropsWithChildren) => {
  const { floating } = PopoverContext.useRequiredValue()
  return (
    <Slot {...props} onClick={() => floating.context.onOpenChange(false)} />
  )
}

export namespace PopoverPrimitive {
  export namespace Root {
    export type Props = ComponentProps<typeof PopoverPrimitiveRoot>
  }
}

export const PopoverPrimitive = {
  Root: PopoverPrimitiveRoot,
  Trigger: PopoverPrimitiveTrigger,
  Content: PopoverPrimitiveContent,
  Title: PopoverPrimitiveTitle,
  Description: PopoverPrimitiveDescription,
  Close: PopoverPrimitiveClose,
}
