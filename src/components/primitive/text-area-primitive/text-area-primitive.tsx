import { type ChangeEvent, type HTMLProps, useRef } from "react"

import { css } from "goober"

import { type AutoSizeConfig, useAutoGrow } from "./use-auto-grow"
import { cn } from "../../../utils/cn"
import { mergeRefs } from "../../../utils/merge-refs"

const DEFAULT_MIN_LINES = 3

const normalizeConfig = (
  autoGrow: TextAreaPrimitiveProps["autoGrow"]
): AutoSizeConfig | null => {
  if (autoGrow === false) return null

  if (typeof autoGrow === "object") {
    return {
      minLines: autoGrow.minLines ?? DEFAULT_MIN_LINES,
      maxLines: autoGrow.maxLines,
    }
  }

  return { minLines: DEFAULT_MIN_LINES }
}

const noResize = css`
  resize: none;
`

type BaseTextAreaProps = HTMLProps<HTMLTextAreaElement>
export interface TextAreaPrimitiveProps extends Omit<
  BaseTextAreaProps,
  "onChange" | "value"
> {
  value?: string
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void
  autoGrow?: boolean | Partial<AutoSizeConfig>
}

export const TextAreaPrimitive = ({
  autoGrow,
  ref: refProp,
  className,
  onChange,
  ...props
}: TextAreaPrimitiveProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  useAutoGrow({ ref, config: normalizeConfig(autoGrow) })
  return (
    <textarea
      {...props}
      ref={mergeRefs(refProp, ref)}
      className={cn(noResize, className)}
      onChange={event => onChange?.(event.target.value, event)}
    />
  )
}
