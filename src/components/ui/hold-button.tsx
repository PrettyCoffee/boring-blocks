import { type PointerEvent, useRef, useState } from "react"

import { cva } from "class-variance-authority"

import { Button, type ButtonProps } from "./button"
import { animate } from "../../utils/animate"
import { cn } from "../../utils/cn"
import { measureText } from "../../utils/measure-text"
import { type ButtonPrimitiveProps } from "../primitive/button-primitive"

const holdButton = cva("overflow-hidden", {
  variants: {
    look: {
      key: "active:bgl-layer-invert/15",
      ghost: "active:bgl-layer/10",
      flat: "active:bgl-layer/10",
      destructive: "active:bg-alert-error/15",
    },
  },
})

const holdButtonFill = cva(
  "absolute inset-0 z-0 block -translate-x-full [&~*,*:has(~&)]:z-1",
  {
    variants: {
      look: {
        key: "bg-max-invert/50",
        ghost: "bg-max-invert/15",
        flat: "bg-max-invert/15",
        destructive: "bg-alert-error/15",
      },
    },
  }
)

const states = animate.states({
  idle: { translate: "-100%" },
  hold: { translate: "0" },
})
const animateHold = (holdDuration: number) => {
  let anim: ReturnType<typeof animate> | null = null

  const start = (span: HTMLElement | null) => {
    if (!span) return
    anim = animate([
      [span, states.idle, {}],
      [span, states.hold, { duration: holdDuration }],
      [span, states.hold, { duration: holdDuration / 2 }],
      [span, states.idle, { duration: holdDuration / 2 }],
    ])
    void anim.then(() => (anim = null))
  }

  const cancel = (span: HTMLElement | null) => {
    if (!anim || !span) return
    anim.cancel()
    const { translate } = window.getComputedStyle(span)
    void animate([
      [span, { translate }],
      [span, states.idle, { duration: 300 }],
    ])
  }

  return { start, cancel }
}

type DefaultButtonProps = Omit<ButtonProps, keyof ButtonPrimitiveProps> &
  Omit<
    ButtonPrimitiveProps<"button">,
    "asChild" | "href" | "target" | "aria-current"
  >

export type HoldButtonProps = Omit<
  DefaultButtonProps,
  "asChild" | "aria-current" | "look"
> & {
  look?: Exclude<DefaultButtonProps["look"], "link">
  holdDuration?: number
  captions: {
    idle: string
    holding: string
    triggered: string
  }
}
export const HoldButton = ({
  holdDuration = 1500,
  onClick,
  onPointerDown,
  onPointerUp,
  className,
  look = "flat",
  captions,
  ...props
}: HoldButtonProps) => {
  const timeout = useRef<number>(undefined)
  const fillSpan = useRef<HTMLSpanElement>(null)
  const hold = useRef(animateHold(holdDuration))

  const [status, setStatus] = useState<"idle" | "holding" | "triggered">("idle")

  const start = (event: PointerEvent<HTMLButtonElement>) => {
    setStatus("holding")
    hold.current.start(fillSpan.current)
    window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => {
      setStatus("triggered")
      timeout.current = window.setTimeout(() => setStatus("idle"), holdDuration)
      onClick?.(event)
    }, holdDuration)
  }

  const stop = () => {
    if (status !== "holding") return
    setStatus("idle")
    window.clearTimeout(timeout.current)
    hold.current.cancel(fillSpan.current)
  }

  return (
    <Button
      {...props}
      onClick={() => null}
      className={cn(holdButton({ look }), className)}
      look={look}
      onPointerDown={event => {
        onPointerDown?.(event)
        start(event)
      }}
      onPointerUp={event => {
        onPointerUp?.(event)
        stop()
      }}
      onPointerLeave={event => {
        onPointerUp?.(event)
        stop()
      }}
    >
      <span ref={fillSpan} className={holdButtonFill({ look })} />
      <div
        ref={div => {
          if (!div) return
          const minWidth = Math.max(
            ...Object.values(captions).map(text => measureText(text, div))
          )
          div.style.setProperty("min-width", minWidth + "px")
        }}
      >
        {captions[status]}
      </div>
    </Button>
  )
}
