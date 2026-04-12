import { type PropsWithChildren, type ChangeEvent, useState } from "react"

import { css, keyframes } from "goober"

import { CheckIcon, MinusIcon } from "../icons"
import { Icon } from "./icon"
import { focusWithinOutline } from "../../styles/focus-within-outline"
import { interactive } from "../../styles/interactive"
import { hstack } from "../../styles/stack"
import { type ClassNameProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { SelectionBoxPrimitive } from "../primitive/selection-box-primitive"
import { AnimateHeight } from "../utility/animate-height"

const CheckboxLabel = ({
  children,
}: PropsWithChildren<Pick<CheckboxProps, "checked">>) => (
  <AnimateHeight duration={150}>
    <div
      className={cn(
        "relative line-clamp-3 text-text transition-colors duration-200 ease-out [[data-checked]~*_&]:line-clamp-1 [[data-checked]~*_&]:text-text-muted [[data-checked]~*_&]:delay-100"
      )}
    >
      <span
        className={cn(
          "absolute -inset-x-1 top-1/2 h-px origin-left -translate-y-1/2 rounded-full bg-text-gentle shade-low",
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

export interface CheckboxProps extends ClassNameProp {
  checked?: SelectionBoxPrimitive.CheckedState
  initialChecked?: SelectionBoxPrimitive.CheckedState
  onCheckedChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>
  ) => void
}

export const Checkbox = ({
  checked,
  initialChecked,
  onCheckedChange,
  className,
  children,
}: PropsWithChildren<CheckboxProps>) => {
  const [didChange, setDidChange] = useState(false)

  return (
    <label
      className={cn(
        interactive({ look: "flat" }),
        hstack({ gap: 3 }),
        "relative min-h-10 min-w-10 shrink-0 rounded-md",
        children && "py-2 pr-3 pl-11",
        focusWithinOutline,
        className
      )}
    >
      <SelectionBoxPrimitive
        type="checkbox"
        checked={checked}
        initialChecked={initialChecked}
        onCheckedChange={(checked, event) => {
          setDidChange(true)
          onCheckedChange?.(checked, event)
        }}
        className={cn(
          "absolute top-2 left-2 inline-grid size-6 shrink-0 place-content-center rounded-sm border border-stroke/50 shade-low [:hover>&]:border-stroke",
          className
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

      {children && <CheckboxLabel>{children}</CheckboxLabel>}
    </label>
  )
}
