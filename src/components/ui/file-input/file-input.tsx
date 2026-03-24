import { useState } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { alert as alertStyles } from "../../../styles/alert"
import { focusWithinOutline } from "../../../styles/focus-within-outline"
import { interactive } from "../../../styles/interactive"
import { hstack } from "../../../styles/stack"
import { type Alert } from "../../../types/alert"
import { cn } from "../../../utils/cn"
import { FileInputPrimitive } from "../../primitive/file-input-primitive"
import { Icon } from "../icon"
import { TitleTooltip } from "../tooltip"
import { UploadIcon as AnimatedUploadIcon } from "./upload-icon"
import { ErrorBoundary } from "../../utility/error-boundary"

const fileInput = cva(
  cn(
    focusWithinOutline,
    hstack({ inline: true, gap: 4, align: "center", justify: "center" }),
    "relative cursor-pointer rounded-md border-2 border-dashed border-stroke-muted p-6",
    interactive({ look: "flat" })
  ),
  {
    variants: {
      dragging: {
        idle: "",
        invalid: cn(interactive({ look: "destructive" }), "border-2"),
        valid: "border-stroke",
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

export type FileInputProps = Omit<
  FileInputPrimitive.Props,
  "onDragStart" | "onDragEnd"
> & {
  label?: string
  alert?: Alert
}

export const FileInput = ({
  label = "Drop File",
  alert,
  className,
  onChange,
  ...props
}: Omit<FileInputProps, "onDragStart" | "onDragEnd">) => {
  const [dragging, setDragging] = useState<DraggingState>("idle")

  return (
    <ErrorBoundary>
      <TitleTooltip title={alert?.text}>
        <FileInputPrimitive
          {...props}
          onDragStart={files =>
            files.length === 0 || files.some(file => !file.isValidType)
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
          <AnimatedUploadIcon status={dragging} />
          {label}
          {alert && (
            <Icon icon={alertStyles[alert.kind].icon} color={alert.kind} />
          )}
        </FileInputPrimitive>
      </TitleTooltip>
    </ErrorBoundary>
  )
}
