import { type CSSProperties, useEffect, useRef, useState } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { FileCheckIcon, FileIcon, FileXIcon, UploadIcon } from "../icons"
import { Icon, type IconProps } from "./icon"
import { TitleTooltip } from "./tooltip"
import { alert as alertStyles } from "../../styles/alert"
import { focusWithinOutline } from "../../styles/focus-within-outline"
import { interactive } from "../../styles/interactive"
import { hstack } from "../../styles/stack"
import { type Alert } from "../../types/alert"
import { type IconProp } from "../../types/base-props"
import { animate } from "../../utils/animate"
import { cn } from "../../utils/cn"
import { FileInputPrimitive } from "../primitive/file-input-primitive"

const fileInput = cva(
  cn(
    focusWithinOutline,
    hstack({ inline: true, gap: 2, align: "center", justify: "center" }),
    "relative cursor-pointer rounded-md border-2 border-dashed border-stroke p-6",
    interactive({ look: "flat" }),
    "pl-16"
  ),
  {
    variants: {
      dragging: {
        idle: "",
        invalid: cn(interactive({ look: "destructive" }), "border-2"),
        valid: "border-highlight",
        accepted: "[svg]:text-alert-success",
      },
      alert: {
        info: alertStyles.info.border,
        success: alertStyles.success.border,
        warn: alertStyles.warn.border,
        error: alertStyles.error.border,
      },
    },
  }
)

type DraggingState = NonNullable<VariantProps<typeof fileInput>["dragging"]>

const animStyles = {
  init: { opacity: 0, translate: "0 1.5rem", zoom: "75%" },
  visible: { opacity: 1, translate: "0 0", zoom: "100%" },
  out: { opacity: 0, translate: "0 -1.5rem", zoom: "75%" },
} satisfies Record<string, CSSProperties>

const IconPos = ({
  status,
  dragging,
  ...props
}: IconProps & {
  status: DraggingState
  dragging: DraggingState
}) => {
  const ref = useRef<SVGSVGElement>(null)
  const [mounted, setMounted] = useState<false | "in" | "out" | true>(
    status === dragging
  )

  useEffect(() => {
    const shouldBeMounted = status == dragging
    if (mounted === false && shouldBeMounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted("in")
      return
    }
    if (mounted === true && !shouldBeMounted) {
      setMounted("out")
      return
    }
  }, [dragging, mounted, status])

  useEffect(() => {
    const icon = ref.current
    if (!icon) return

    if (mounted === "in") {
      const animateIn = animate([
        [icon, animStyles.init],
        [icon, animStyles.visible, { duration: 300, ease: "bounce" }],
      ])
      void animateIn.then(() => setMounted(true))
      return animateIn.cancel
    }
    if (mounted === "out") {
      const animateOut = animate([
        [icon, animStyles.visible],
        [icon, animStyles.out, { duration: 100 }],
        [icon, animStyles.init],
      ])
      void animateOut.then(() => setMounted(false))
      return animateOut.cancel
    }

    return
  }, [mounted])

  return (
    <div
      className={cn(
        "absolute left-6 grid size-5 place-content-center",
        !mounted && "hidden"
      )}
    >
      <Icon ref={ref} {...props} />
    </div>
  )
}

type FileInputProps = Omit<
  FileInputPrimitive.Props,
  "onDragStart" | "onDragEnd"
> &
  IconProp & {
    label?: string
    alert?: Alert
  }

export const FileInput = ({
  label = "Drop File",
  alert,
  icon = UploadIcon,
  className,
  onChange,
  ...props
}: Omit<FileInputProps, "onDragStart" | "onDragEnd">) => {
  const [dragging, setDragging] = useState<DraggingState>("idle")

  return (
    <TitleTooltip title={alert?.text}>
      <FileInputPrimitive
        {...props}
        onDragStart={files =>
          files.some(file => !file.isValidType)
            ? setDragging("invalid")
            : setDragging("valid")
        }
        onDragEnd={() => setDragging("idle")}
        onChange={(files, event) => {
          onChange?.(files, event)
          setDragging("accepted")
        }}
        className={cn(fileInput({ dragging, alert: alert?.kind }), className)}
      >
        <IconPos
          dragging={dragging}
          status="accepted"
          icon={FileCheckIcon}
          color="success"
        />
        <IconPos
          dragging={dragging}
          status="valid"
          icon={FileIcon}
          color="default"
        />
        <IconPos
          dragging={dragging}
          status="invalid"
          icon={FileXIcon}
          color="error"
        />
        <IconPos
          dragging={dragging}
          status="idle"
          icon={icon}
          color="default"
        />
        {label}
        {alert && (
          <Icon icon={alertStyles[alert.kind].icon} color={alert.kind} />
        )}
      </FileInputPrimitive>
    </TitleTooltip>
  )
}
