import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react"

import { animate } from "../../../index-utils"
import { hstack, vstack } from "../../../styles/stack"
import { surface } from "../../../styles/surface"
import { zIndex } from "../../../styles/z-index"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { XIcon } from "../../icons"
import { DialogPrimitive } from "../../primitive/dialog-primitive"
import { Button, type ButtonProps } from "../button"
import { IconButton } from "../icon-button"

const transition = animate.states({
  overlayShow: { opacity: 1, backdropFilter: "blur(var(--blur-sm)" },
  overlayHide: { opacity: 0, backdropFilter: "blur(0)" },
  contentShow: { opacity: 1, scale: "1" },
  contentHide: { opacity: 0, scale: "0.5" },
})

interface DialogAction extends Pick<ButtonProps, "look" | "disabled"> {
  /** Caption displayed inside the button */
  caption?: string
  /** Handler to be called when clicking the button */
  onClick?: () => void
}

export interface DialogProps extends ClassNameProp {
  /** Headline to be displayed inside the dialog */
  title: string
  /** Describe to the user what effect the dialog has */
  description?: ReactNode
  /** Handler to be called when the dialog is closed */
  onClose?: () => void
  /** Caption and action of the confirm button in the dialog */
  confirm?: DialogAction
  /** Caption and action of the cancel button in the dialog */
  cancel?: DialogAction
}

const DialogActions = ({
  confirm,
  cancel,
  onClose,
}: Pick<DialogProps, "confirm" | "cancel" | "onClose">) => {
  if (!confirm && !cancel) return null

  return (
    <div className={cn(hstack({ gap: 2, wrap: true }), "px-4 pb-4")}>
      {confirm && (
        <Button
          look={confirm.look ?? "key"}
          disabled={confirm.disabled}
          onClick={() => {
            onClose?.()
            confirm.onClick?.()
          }}
        >
          {
            // TODO: Translate caption
            confirm.caption ?? "Confirm"
          }
        </Button>
      )}
      {cancel && (
        <Button
          look={cancel.look ?? "flat"}
          disabled={cancel.disabled}
          onClick={() => {
            onClose?.()
            cancel.onClick?.()
          }}
        >
          {
            // TODO: Translate caption
            cancel.caption ?? "Cancel"
          }
        </Button>
      )}
    </div>
  )
}

export const Dialog = ({
  title,
  description,
  onClose,
  children,
  confirm,
  cancel,
  className,
}: PropsWithChildren<DialogProps>) => {
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null)
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!overlayRef || !contentRef) return

    const anim = animate([
      [overlayRef, transition.overlayHide],
      [overlayRef, transition.overlayShow, { duration: 200 }],
      [contentRef, transition.contentHide, { at: 0 }],
      [contentRef, transition.contentShow, { duration: 200 }],
    ])

    return () => {
      anim.cancel()
    }
  }, [contentRef, overlayRef])

  const close = () => {
    if (!overlayRef || !contentRef) return

    void animate([
      [overlayRef, transition.overlayShow],
      [overlayRef, transition.overlayHide, { duration: 100 }],
      [contentRef, transition.contentShow, { at: 0 }],
      [contentRef, transition.contentHide, { duration: 100 }],
    ]).then(onClose)
  }

  return (
    <DialogPrimitive.Root onClose={close}>
      <DialogPrimitive.Overlay
        ref={element => {
          setOverlayRef(prev => prev ?? element)
        }}
        className={cn(
          "fixed inset-0 size-full bg-background-page/50 backdrop-blur-sm",
          zIndex.dialog
        )}
      />

      <DialogPrimitive.Content
        ref={element => {
          setContentRef(prev => prev ?? element)
        }}
        className={cn(
          vstack({}),
          surface({ look: "overlay", size: "lg" }),
          "fixed inset-1/2 h-max w-96 -translate-1/2 p-0 shade-medium",
          zIndex.dialog,
          className
        )}
      >
        <DialogPrimitive.Title
          className={cn(
            hstack({ align: "center" }),
            "h-12 truncate pr-12 pl-4 text-xl text-text-priority"
          )}
        >
          <span className="truncate">{title}</span>
        </DialogPrimitive.Title>

        {description && (
          <DialogPrimitive.Description className="px-4 pb-4 text-sm text-text-gentle">
            {description}
          </DialogPrimitive.Description>
        )}

        {children && (
          <div className="flex-1 overflow-auto px-4 pb-4">{children}</div>
        )}

        <DialogActions confirm={confirm} cancel={cancel} onClose={close} />

        <DialogPrimitive.Close>
          <IconButton
            // TODO: Translate title
            title="Close"
            className="absolute top-1 right-1"
            hideTitle
            icon={XIcon}
            onClick={cancel?.onClick}
          />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  )
}
