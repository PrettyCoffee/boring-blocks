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
        hstack({ gap: 3, align: "center" }),
        "h-10 shrink-0 rounded-md pl-2",
        !children ? "pr-2" : "pr-3",
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
          "inline-grid size-6 shrink-0 place-content-center rounded-sm border border-stroke/50 [:hover>&]:border-stroke",
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

      {children && (
        <div
          className={cn(
            "text-text transition-colors duration-200 ease-out [[data-checked]~&]:text-text-muted [[data-checked]~&]:delay-100",
            "relative before:absolute before:-inset-x-1 before:top-1/2 before:h-px before:origin-left before:-translate-y-1/2 before:rounded-full before:bg-text-gentle before:shade-low",
            "before:scale-x-0 before:transition-transform before:duration-200 before:ease-out [[data-checked]~&]:before:scale-x-100 [[data-checked]~&]:before:delay-100"
          )}
        >
          {children}
        </div>
      )}
    </label>
  )
}
