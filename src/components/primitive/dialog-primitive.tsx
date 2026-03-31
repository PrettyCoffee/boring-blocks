import { type PropsWithChildren, useMemo, type HTMLProps } from "react"

import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
  useId,
} from "@floating-ui/react"

import { createContext } from "../../utils/create-context"
import { mergeRefs } from "../../utils/merge-refs"
import { Slot } from "../utility/slot"

interface DialogOptions {
  onClose?: () => void
}

const useDialog = ({ onClose }: DialogOptions = {}) => {
  const id = useId()
  const titleId = `${id}-dialog-title`
  const descriptionId = `${id}-dialog-description`

  const floating = useFloating({
    open: true,
    onOpenChange: open => {
      if (!open) onClose?.()
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
        "aria-labelledby": titleId,
        "aria-describedby": descriptionId,
      })

    return {
      floating,
      titleId,
      descriptionId,
      getFloatingProps,
    }
  }, [interactions, titleId, descriptionId, floating])
}

const DialogPrimitiveContext =
  createContext<ReturnType<typeof useDialog>>("DialogPrimitive")

const DialogPrimitiveRoot = ({
  children,
  onClose,
}: PropsWithChildren<DialogOptions>) => {
  const dialog = useDialog({ onClose })
  return (
    <DialogPrimitiveContext.Provider value={dialog}>
      <FloatingPortal>{children}</FloatingPortal>
    </DialogPrimitiveContext.Provider>
  )
}

const DialogPrimitiveOverlay = (props: HTMLProps<HTMLDivElement>) => (
  <FloatingOverlay {...props} lockScroll />
)

const DialogPrimitiveContent = ({
  children,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const context = DialogPrimitiveContext.useRequiredValue()
  return (
    <FloatingFocusManager context={context.floating.context}>
      <div {...context.getFloatingProps(props)}>{children}</div>
    </FloatingFocusManager>
  )
}

const DialogPrimitiveTitle = ({
  children,
  ...props
}: HTMLProps<HTMLHeadingElement>) => {
  const { titleId } = DialogPrimitiveContext.useRequiredValue()
  return (
    <h2 {...props} id={titleId}>
      {children}
    </h2>
  )
}

const DialogPrimitiveDescription = ({
  children,
  ...props
}: HTMLProps<HTMLParagraphElement>) => {
  const { descriptionId } = DialogPrimitiveContext.useRequiredValue()
  return (
    <p {...props} id={descriptionId}>
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
