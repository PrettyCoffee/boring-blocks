import {
  type PropsWithChildren,
  useMemo,
  type HTMLProps,
  useState,
  useId,
  useLayoutEffect,
} from "react"

import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from "@floating-ui/react"

import { createContext } from "../../utils/create-context"
import { mergeRefs } from "../../utils/merge-refs"
import { Slot } from "../utility/slot"

interface DialogOptions {
  onClose?: () => void
  closeDuration?: number
}

const useDialog = ({ onClose, closeDuration }: DialogOptions = {}) => {
  const [open, setOpen] = useState(true)
  const [labelId, setLabelId] = useState<string>()
  const [descriptionId, setDescriptionId] = useState<string>()

  const floating = useFloating({
    open,
    onOpenChange: open => {
      setOpen(open)
      if (onClose && !open) {
        if (closeDuration) {
          window.setTimeout(onClose, closeDuration)
        } else {
          onClose()
        }
      }
    },
  })

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context, { outsidePressEvent: "mousedown" }),
    useRole(floating.context, { role: "dialog" }),
  ])

  return useMemo(() => {
    const getFloatingProps: typeof interactions.getFloatingProps = props =>
      interactions.getFloatingProps({
        ...props,
        ref: mergeRefs(floating.context.refs.setFloating, props?.ref),
        "aria-labelledby": labelId,
        "aria-describedby": descriptionId,
      })

    return {
      floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      getFloatingProps,
    }
  }, [interactions, labelId, descriptionId, floating])
}

const DialogPrimitiveContext =
  createContext<ReturnType<typeof useDialog>>("DialogPrimitive")

const DialogPrimitiveRoot = ({
  children,
  ...options
}: PropsWithChildren<DialogOptions>) => {
  const dialog = useDialog(options)
  return (
    <DialogPrimitiveContext.Provider value={dialog}>
      <FloatingPortal>{children}</FloatingPortal>
    </DialogPrimitiveContext.Provider>
  )
}

const DialogPrimitiveOverlay = (props: HTMLProps<HTMLDivElement>) => {
  const { floating } = DialogPrimitiveContext.useRequiredValue()
  return (
    <FloatingOverlay
      {...props}
      lockScroll
      data-open={floating.context.open ? "true" : undefined}
      data-close={!floating.context.open ? "true" : undefined}
    />
  )
}

const DialogPrimitiveContent = ({
  children,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const { floating, getFloatingProps } =
    DialogPrimitiveContext.useRequiredValue()

  return (
    <FloatingFocusManager context={floating.context}>
      <div
        {...getFloatingProps(props)}
        data-open={floating.context.open ? "true" : undefined}
        data-close={!floating.context.open ? "true" : undefined}
      >
        {children}
      </div>
    </FloatingFocusManager>
  )
}

const DialogPrimitiveTitle = ({
  children,
  ...props
}: HTMLProps<HTMLHeadingElement>) => {
  const { setLabelId } = DialogPrimitiveContext.useRequiredValue()
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

const DialogPrimitiveDescription = ({
  children,
  ...props
}: HTMLProps<HTMLParagraphElement>) => {
  const { setDescriptionId } = DialogPrimitiveContext.useRequiredValue()
  const id = useId()

  // Only set `aria-describedby` if this component is used
  useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [id, setDescriptionId])

  return (
    <p {...props} id={id}>
      {children}
    </p>
  )
}

const DialogPrimitiveClose = ({ children }: PropsWithChildren) => {
  const { floating } = DialogPrimitiveContext.useRequiredValue()
  return (
    <Slot onClick={() => floating.context.onOpenChange(false)}>{children}</Slot>
  )
}

export const DialogPrimitive = {
  Root: DialogPrimitiveRoot,
  Overlay: DialogPrimitiveOverlay,
  Content: DialogPrimitiveContent,
  Title: DialogPrimitiveTitle,
  Description: DialogPrimitiveDescription,
  Close: DialogPrimitiveClose,
}
