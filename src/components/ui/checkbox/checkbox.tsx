import { type PropsWithChildren, type ChangeEvent, useState } from "react"

import { css, keyframes } from "goober"

import { focusOutline } from "../../../styles/focus-outline"
import { interactive } from "../../../styles/interactive"
import { hstack } from "../../../styles/stack"
import { type RefProp, type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { CheckIcon, MinusIcon } from "../../icons"
import { SelectionBoxPrimitive } from "../../primitive/selection-box-primitive"
import { AnimateHeight } from "../../utility/animate-height"
import { Icon } from "../icon"
import { labelStyles } from "./label-styles"
import { ErrorBoundary } from "../../utility/error-boundary"

const CheckboxLabel = ({
  children,
}: PropsWithChildren<Pick<CheckboxProps, "checked">>) => (
  <AnimateHeight duration={150}>
    <div
      className={cn(
        labelStyles.text,
        "relative line-clamp-3 text-sm text-text transition-colors duration-200 ease-out [[data-checked]~*_&]:line-clamp-1 [[data-checked]~*_&]:text-text-muted [[data-checked]~*_&]:delay-100"
      )}
    >
      <span
        className={cn(
          "absolute -inset-x-1 top-2.5 h-px origin-left -translate-y-1/2 rounded-full bg-text-gentle shade-low",
          "scale-x-0 transition-transform duration-200 ease-out [[data-checked]~*_&]:scale-x-100 [[data-checked]~*_&]:delay-100"
        )}
      />
      {children}
    </div>
  </AnimateHeight>
)

const wiggle = keyframes`
  0% {
    rotate: 0deg;
    scale: 0.5;
    opacity: 0;
  }
  20% {
    rotate: 10deg;
  }
  40% {
    rotate: -10deg;
    scale: 1;
    opacity: 1;
  }
  80% {
    rotate: 10deg;
  }
  100% {
    rotate: 0deg;
  }
`

const checkAnimation = css`
  animation: 300ms ${wiggle} ease-out;
`

export interface CheckboxProps
  extends ClassNameProp, RefProp<HTMLInputElement> {
  value?: string
  name?: string
  label?: string
  checked?: SelectionBoxPrimitive.CheckedState
  initialChecked?: SelectionBoxPrimitive.CheckedState
  onCheckedChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>
  ) => void
}

export const Checkbox = ({
  onCheckedChange,
  className,
  label,
  ...props
}: CheckboxProps) => {
  const [didChange, setDidChange] = useState(false)

  return (
    <ErrorBoundary>
      <label
        className={cn(
          interactive({ look: "flat" }),
          hstack({ gap: 3 }),
          "relative min-h-10 min-w-10 shrink-0 rounded-md",
          focusOutline.within,
          label && labelStyles.layout,
          className
        )}
      >
        <SelectionBoxPrimitive
          {...props}
          type="checkbox"
          onCheckedChange={(checked, event) => {
            setDidChange(true)
            onCheckedChange?.(checked, event)
          }}
          className={cn(
            "absolute top-2 left-2 inline-grid size-6 shrink-0 place-content-center rounded-sm border border-stroke/50 shade-low [:hover>&]:border-stroke"
          )}
        >
          {checked =>
            checked === true ? (
              <Icon
                icon={CheckIcon}
                color="highlight"
                size="xs"
                strokeWidth={4}
                className={cn(didChange && checkAnimation)}
              />
            ) : checked === "indeterminate" ? (
              <Icon
                icon={MinusIcon}
                color="muted"
                size="xs"
                strokeWidth={4}
                className={cn(didChange && checkAnimation)}
              />
            ) : null
          }
        </SelectionBoxPrimitive>

        {label && <CheckboxLabel>{label}</CheckboxLabel>}
      </label>
    </ErrorBoundary>
  )
}
