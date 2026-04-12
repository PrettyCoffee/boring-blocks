import { type ChangeEvent, type Dispatch, type KeyboardEvent } from "react"

import { css } from "goober"

import { Checkbox, type CheckboxProps } from "./checkbox"
import { labelStyles } from "./label-styles"
import { cn } from "../../../utils/cn"
import { InputBorder } from "../fragments/input-border"

const textAreaStyles = css`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-text-fill-color: transparent;

  &::placeholder {
    -webkit-text-fill-color: initial;
  }
`

export interface CheckboxEditorProps extends Omit<
  CheckboxProps,
  "name" | "value" | "ref"
> {
  /** Placeholder to be displayed if label "is empty */
  placeholder: string
  /** Handler to be called when label is changed */
  onLabelChange: Dispatch<string>
  /** Handler to be called when pressing enter */
  onEnterDown?: () => void
}
export const CheckboxEditor = ({
  checked,
  initialChecked,
  label,
  placeholder,
  onCheckedChange,
  onLabelChange,
  onEnterDown,
  className,
}: CheckboxEditorProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      onEnterDown?.()
      return
    }
  }

  const handleLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onLabelChange(event.target.value)
  }

  return (
    <InputBorder
      className={cn("relative flex h-max min-h-10 items-start", className)}
      hoverClassName={cn(
        "has-[textarea:hover:not(:focus-visible)]:border-stroke"
      )}
      focusVisibleClassName={cn(
        "has-[textarea:focus-visible]:border-stroke-focus"
      )}
    >
      <Checkbox
        checked={checked}
        initialChecked={initialChecked}
        onCheckedChange={onCheckedChange}
        className="absolute -top-px -left-px z-1"
      />
      <div className="-m-px max-h-20 flex-1 overflow-y-auto" tabIndex={-1}>
        <div className="relative">
          <textarea
            value={label}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onChange={handleLabelChange}
            className={cn(
              labelStyles.layout,
              labelStyles.text,
              textAreaStyles,
              "absolute inset-0 size-full resize-none outline-none"
            )}
          />
          <div
            aria-hidden
            className={cn(
              labelStyles.layout,
              labelStyles.text,
              "overflow-hidden",
              !label && "text-text-muted"
            )}
          >
            {label || placeholder}
          </div>
        </div>
      </div>
    </InputBorder>
  )
}
