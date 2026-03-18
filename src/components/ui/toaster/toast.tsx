import { useCallback, useEffect, useRef } from "react"

import { keyframes } from "goober"
import { X } from "lucide-react"

import { Icon } from "../icon"
import { ToastDataProps } from "./toaster-data"
import { alert } from "../../../styles/alert"
import { hstack } from "../../../styles/stack"
import { surface } from "../../../styles/surface"
import { animate } from "../../../utils/animate"
import { cn } from "../../../utils/cn"
import { Button, ButtonProps } from "../button"
import { IconButton } from "../icon-button"

interface ExtendedToastProps extends ToastDataProps {
  onClose: (id: string) => void
}

const shrinkTimeBar = keyframes`
  0% {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.125rem;
  }
  100% {
    left: 100%;
    right: 0.5rem;
    bottom: 0.125rem;
  }
`

const enterAnimation = (element?: HTMLElement | null) => {
  if (!element) return

  const hidden = { opacity: 0, scale: 0.5 }
  const visible = { opacity: 1, scale: 1 }

  return animate([
    [element, hidden],
    [element, visible, { duration: 150, ease: "out" }],
  ])
}

const exitAnimation = (element?: HTMLElement | null) => {
  if (!element) return

  const swipeOut = { opacity: 0, transform: "translateX(100%)" }
  const noSize = { height: 0, width: 0, padding: 0, margin: 0, borderWidth: 0 }

  return animate([
    [element, swipeOut, { duration: 300, ease: "out" }],
    [element, noSize, { at: 100, duration: 200, ease: "bounce" }],
  ])
}

export const Toast = ({
  id,
  kind,
  title,
  message,
  actions,
  duration,
  onClose,
}: ExtendedToastProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const timeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    const transition = enterAnimation(ref.current)
    return () => {
      transition?.cancel()
    }
  }, [])

  const exit = useCallback(() => {
    window.clearTimeout(timeout.current)
    const transition = exitAnimation(ref.current)
    void transition?.then(() => {
      onClose(id)
    })

    return () => transition?.cancel()
  }, [id, onClose])

  useEffect(() => {
    let cancel: (() => void) | null = null
    if (duration) {
      timeout.current = window.setTimeout(() => {
        cancel = exit()
      }, duration)
    }
    return () => {
      window.clearTimeout(timeout.current)
      cancel?.()
    }
  }, [duration, exit])

  return (
    <div
      ref={ref}
      className={cn(
        surface({ look: "overlay", size: "md" }),
        "relative my-1 w-screen max-w-96 overflow-hidden border-2 p-1",
        alert[kind].borderGentle
      )}
    >
      <div className={hstack({})}>
        <div className="grid size-10 place-items-center">
          <Icon icon={alert[kind].icon} color={kind} size="lg" />
        </div>
        <div className="my-2 flex-1 overflow-hidden">
          <div className="truncate text-text-priority">{title}</div>
          {message && (
            <div className="mt-1 line-clamp-3 text-sm text-text">{message}</div>
          )}
        </div>
        <IconButton
          icon={X}
          // TODO: Translate title
          title="Close message"
          hideTitle
          look="flat"
          onClick={() => void exit()}
        />
      </div>
      {actions && (
        <div
          className={cn(
            hstack({ justify: "end", gap: 2, wrap: true }),
            duration && "pb-2"
          )}
        >
          {actions.map(({ label, ...action }) => (
            <Button key={label} {...(action as ButtonProps)}>
              {label}
            </Button>
          ))}
        </div>
      )}
      <span
        className={cn("absolute h-0.5 rounded-sm", alert[kind].bg)}
        style={{
          animation: `${shrinkTimeBar} ${duration ?? 0}ms linear forwards`,
        }}
      />
    </div>
  )
}
